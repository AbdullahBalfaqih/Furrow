import { expect } from "chai";
import { ethers } from "hardhat";
import { CropRegistry, FurrowAccessControl } from "../typechain-types";

describe("CropRegistry Contract", function () {
  let accessControl: FurrowAccessControl;
  let cropRegistry: CropRegistry;
  let admin: any;
  let farmer: any;
  let unauthorizedUser: any;

  const sampleCropType = "Organic Premium Tomatoes";
  const sampleCID = "0g://bafybeic2h...92c1";
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("metadata-v1-tomatoes"));
  const sampleHarvestDate = Math.floor(Date.now() / 1000) - 86400; // 1 day ago

  beforeEach(async function () {
    [admin, farmer, unauthorizedUser] = await ethers.getSigners();

    const AccessControlFactory = await ethers.getContractFactory("FurrowAccessControl");
    accessControl = await AccessControlFactory.deploy(admin.address);
    await accessControl.waitForDeployment();

    const CropRegistryFactory = await ethers.getContractFactory("CropRegistry");
    cropRegistry = await CropRegistryFactory.deploy(await accessControl.getAddress());
    await cropRegistry.waitForDeployment();
  });

  describe("Crop Registration", function () {
    it("Should successfully register a crop and emit CropRegistered event", async function () {
      await expect(
        cropRegistry.connect(farmer).registerCrop(sampleCropType, sampleCID, sampleHash, sampleHarvestDate)
      )
        .to.emit(cropRegistry, "CropRegistered")
        .withArgs(1, farmer.address, sampleCropType, sampleCID, sampleHash, sampleHarvestDate);

      const crop = await cropRegistry.getCrop(1);
      expect(crop.id).to.equal(1);
      expect(crop.farmer).to.equal(farmer.address);
      expect(crop.cropType).to.equal(sampleCropType);
      expect(crop.storageCID).to.equal(sampleCID);
      expect(crop.metadataHash).to.equal(sampleHash);
      expect(crop.harvestDate).to.equal(sampleHarvestDate);
      expect(crop.status).to.equal(0); // CropStatus.Registered
    });

    it("Should revert registration if cropType is empty", async function () {
      await expect(
        cropRegistry.connect(farmer).registerCrop("", sampleCID, sampleHash, sampleHarvestDate)
      ).to.be.revertedWithCustomError(cropRegistry, "EmptyCropType");
    });

    it("Should revert registration if storageCID is empty", async function () {
      await expect(
        cropRegistry.connect(farmer).registerCrop(sampleCropType, "", sampleHash, sampleHarvestDate)
      ).to.be.revertedWithCustomError(cropRegistry, "EmptyStorageCID");
    });

    it("Should revert registration if metadataHash is zero bytes", async function () {
      await expect(
        cropRegistry.connect(farmer).registerCrop(sampleCropType, sampleCID, ethers.ZeroHash, sampleHarvestDate)
      ).to.be.revertedWithCustomError(cropRegistry, "InvalidMetadataHash");
    });
  });

  describe("Metadata Updates & Permissions", function () {
    beforeEach(async function () {
      await cropRegistry.connect(farmer).registerCrop(sampleCropType, sampleCID, sampleHash, sampleHarvestDate);
    });

    it("Should allow the crop farmer to update metadata", async function () {
      const newCID = "0g://bafybeinew...updated";
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("updated-metadata"));

      await expect(cropRegistry.connect(farmer).updateCropMetadata(1, newCID, newHash))
        .to.emit(cropRegistry, "CropMetadataUpdated")
        .withArgs(1, newCID, newHash);

      const crop = await cropRegistry.getCrop(1);
      expect(crop.storageCID).to.equal(newCID);
      expect(crop.metadataHash).to.equal(newHash);
    });

    it("Should revert when an unauthorized user attempts to update metadata", async function () {
      const newCID = "0g://hacker...malicious";
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("malicious"));

      await expect(
        cropRegistry.connect(unauthorizedUser).updateCropMetadata(1, newCID, newHash)
      ).to.be.revertedWithCustomError(cropRegistry, "UnauthorizedCaller");
    });
  });
});
