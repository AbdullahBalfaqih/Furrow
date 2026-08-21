const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FurrowMarketplace Contract & Full End-To-End Lifecycle", function () {
  let accessControl;
  let cropRegistry;
  let cropAssessment;
  let marketplace;

  let admin;
  let farmer;
  let assessor;
  let buyer1;
  let buyer2;

  const cropType = "Organic Premium Tomatoes";
  const storageCID = "0g://bafybeic2h...tomatoes";
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("tomatoes-metadata"));
  const harvestDate = Math.floor(Date.now() / 1000) - 86400;

  beforeEach(async function () {
    [admin, farmer, assessor, buyer1, buyer2] = await ethers.getSigners();

    // 1. Deploy FurrowAccessControl
    const AccessControlFactory = await ethers.getContractFactory("FurrowAccessControl");
    accessControl = await AccessControlFactory.deploy(admin.address);
    await accessControl.waitForDeployment();

    // 2. Deploy CropRegistry
    const CropRegistryFactory = await ethers.getContractFactory("CropRegistry");
    cropRegistry = await CropRegistryFactory.deploy(await accessControl.getAddress());
    await cropRegistry.waitForDeployment();

    // 3. Deploy CropAssessment
    const CropAssessmentFactory = await ethers.getContractFactory("CropAssessment");
    cropAssessment = await CropAssessmentFactory.deploy(
      await accessControl.getAddress(),
      await cropRegistry.getAddress()
    );
    await cropAssessment.waitForDeployment();

    // 4. Deploy FurrowMarketplace
    const MarketplaceFactory = await ethers.getContractFactory("FurrowMarketplace");
    marketplace = await MarketplaceFactory.deploy(
      await accessControl.getAddress(),
      await cropRegistry.getAddress()
    );
    await marketplace.waitForDeployment();

    // Grant Roles
    const ASSESSOR_ROLE = await accessControl.ASSESSOR_ROLE();
    const MARKETPLACE_ROLE = await accessControl.MARKETPLACE_ROLE();

    await accessControl.grantRole(ASSESSOR_ROLE, assessor.address);
    await accessControl.grantRole(MARKETPLACE_ROLE, await marketplace.getAddress());
  });

  describe("Full Realistic Marketplace Scenario", function () {
    it("Executes full lifecycle: Register -> Assess -> List -> Competing Offers -> Farmer Accepts Top Offer -> Payout & Refund", async function () {
      // Step 1: Farmer registers crop
      await cropRegistry.connect(farmer).registerCrop(cropType, storageCID, metadataHash, harvestDate);
      let crop = await cropRegistry.getCrop(1);
      expect(crop.status).to.equal(0); // CropStatus.Registered

      // Step 2: AI Assessor submits quality assessment
      const qualityScore = 87;
      const grade = "Grade A";
      const estimatedValue = ethers.parseEther("1.2");
      const modelVersion = "v1.4.2-vision";
      const assessmentHash = ethers.keccak256(ethers.toUtf8Bytes("ai-inference-tomatoes"));

      await cropAssessment
        .connect(assessor)
        .submitAssessment(1, qualityScore, grade, estimatedValue, modelVersion, assessmentHash);

      const latestAssessment = await cropAssessment.getLatestAssessment(1);
      expect(latestAssessment.qualityScore).to.equal(87);

      // Step 3: Farmer lists crop on FurrowMarketplace
      const minimumPrice = ethers.parseEther("1.0");
      const expiresAt = Math.floor(Date.now() / 1000) + 7 * 86400; // 7 days from now

      await expect(marketplace.connect(farmer).createListing(1, minimumPrice, expiresAt))
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, 1, farmer.address, minimumPrice, expiresAt);

      crop = await cropRegistry.getCrop(1);
      expect(crop.status).to.equal(1); // CropStatus.Listed

      // Step 4: Buyer1 makes an offer of 1.0 0G
      const buyer1Offer = ethers.parseEther("1.0");
      await expect(marketplace.connect(buyer1).makeOffer(1, { value: buyer1Offer }))
        .to.emit(marketplace, "OfferCreated")
        .withArgs(1, 1, buyer1.address, buyer1Offer);

      // Step 5: Buyer2 makes a higher competing offer of 1.5 0G
      const buyer2Offer = ethers.parseEther("1.5");
      await expect(marketplace.connect(buyer2).makeOffer(1, { value: buyer2Offer }))
        .to.emit(marketplace, "OfferCreated")
        .withArgs(2, 1, buyer2.address, buyer2Offer);

      // Verify listing offers count
      const offers = await marketplace.getListingOffers(1);
      expect(offers.length).to.equal(2);

      // Step 6: Farmer accepts Buyer2's offer (offerId = 2)
      const farmerBalBefore = await ethers.provider.getBalance(farmer.address);

      await expect(marketplace.connect(farmer).acceptOffer(1, 2))
        .to.emit(marketplace, "OfferAccepted")
        .withArgs(1, 2, buyer2.address, buyer2Offer)
        .to.emit(marketplace, "CropSold")
        .withArgs(1, 1, farmer.address, buyer2.address, buyer2Offer);

      const farmerBalAfter = await ethers.provider.getBalance(farmer.address);
      expect(farmerBalAfter).to.be.gt(farmerBalBefore);

      // Step 7: Verify Crop Status is updated to Sold
      crop = await cropRegistry.getCrop(1);
      expect(crop.status).to.equal(2); // CropStatus.Sold

      // Step 8: Buyer1 withdraws unaccepted offer funds
      const buyer1BalBefore = await ethers.provider.getBalance(buyer1.address);
      await expect(marketplace.connect(buyer1).withdrawOffer(1))
        .to.emit(marketplace, "OfferWithdrawn")
        .withArgs(1, 1, buyer1.address, buyer1Offer);

      const buyer1BalAfter = await ethers.provider.getBalance(buyer1.address);
      expect(buyer1BalAfter).to.be.gt(buyer1BalBefore);
    });
  });

  describe("Security & Validation Protections", function () {
    beforeEach(async function () {
      await cropRegistry.connect(farmer).registerCrop(cropType, storageCID, metadataHash, harvestDate);
      const minimumPrice = ethers.parseEther("1.0");
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      await marketplace.connect(farmer).createListing(1, minimumPrice, expiresAt);
    });

    it("Should prevent farmer from making an offer on their own listing (Self-Buying)", async function () {
      await expect(
        marketplace.connect(farmer).makeOffer(1, { value: ethers.parseEther("1.5") })
      ).to.be.revertedWithCustomError(marketplace, "SelfBuyingNotAllowed");
    });

    it("Should revert if buyer offer is below minimum price", async function () {
      await expect(
        marketplace.connect(buyer1).makeOffer(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWithCustomError(marketplace, "MinimumPriceNotMet");
    });

    it("Should prevent double withdrawal of funds", async function () {
      await marketplace.connect(buyer1).makeOffer(1, { value: ethers.parseEther("1.0") });
      await marketplace.connect(buyer1).withdrawOffer(1);

      await expect(
        marketplace.connect(buyer1).withdrawOffer(1)
      ).to.be.revertedWithCustomError(marketplace, "OfferNotActive");
    });

    it("Should prevent withdrawal of an already accepted offer", async function () {
      await marketplace.connect(buyer1).makeOffer(1, { value: ethers.parseEther("1.0") });
      await marketplace.connect(farmer).acceptOffer(1, 1);

      await expect(
        marketplace.connect(buyer1).withdrawOffer(1)
      ).to.be.revertedWithCustomError(marketplace, "OfferNotActive");
    });
  });
});
