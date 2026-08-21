import { expect } from "chai";
import { ethers } from "hardhat";
import { CropRegistry, CropAssessment, FurrowAccessControl } from "../typechain-types";

describe("CropAssessment Contract", function () {
  let accessControl: FurrowAccessControl;
  let cropRegistry: CropRegistry;
  let cropAssessment: CropAssessment;

  let admin: any;
  let farmer: any;
  let assessor: any;
  let unauthorizedUser: any;

  const sampleCropType = "Sukari Dates Premium";
  const sampleCID = "0g://bafybeic2h...dates";
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("dates-meta"));
  const sampleHarvestDate = Math.floor(Date.now() / 1000) - 86400;

  beforeEach(async function () {
    [admin, farmer, assessor, unauthorizedUser] = await ethers.getSigners();

    const AccessControlFactory = await ethers.getContractFactory("FurrowAccessControl");
    accessControl = await AccessControlFactory.deploy(admin.address);
    await accessControl.waitForDeployment();

    const CropRegistryFactory = await ethers.getContractFactory("CropRegistry");
    cropRegistry = await CropRegistryFactory.deploy(await accessControl.getAddress());
    await cropRegistry.waitForDeployment();

    const CropAssessmentFactory = await ethers.getContractFactory("CropAssessment");
    cropAssessment = await CropAssessmentFactory.deploy(
      await accessControl.getAddress(),
      await cropRegistry.getAddress()
    );
    await cropAssessment.waitForDeployment();

    // Grant ASSESSOR_ROLE to assessor signer
    const ASSESSOR_ROLE = await accessControl.ASSESSOR_ROLE();
    await accessControl.grantRole(ASSESSOR_ROLE, assessor.address);

    // Register a test crop
    await cropRegistry.connect(farmer).registerCrop(sampleCropType, sampleCID, sampleHash, sampleHarvestDate);
  });

  describe("AI Assessment Submission", function () {
    const qualityScore = 98;
    const grade = "Grade A+ (98.6%)";
    const estimatedValue = ethers.parseEther("1.2"); // 1.2 0G / Ton
    const modelVersion = "v1.4.2-vision";
    const assessmentHash = ethers.keccak256(ethers.toUtf8Bytes("ai-inference-raw-payload"));

    it("Should allow authorized assessor to submit assessment and retrieve it", async function () {
      await expect(
        cropAssessment
          .connect(assessor)
          .submitAssessment(1, qualityScore, grade, estimatedValue, modelVersion, assessmentHash)
      )
        .to.emit(cropAssessment, "AssessmentSubmitted")
        .withArgs(1, qualityScore, grade, estimatedValue, assessor.address, assessmentHash);

      const latest = await cropAssessment.getLatestAssessment(1);
      expect(latest.cropId).to.equal(1);
      expect(latest.qualityScore).to.equal(qualityScore);
      expect(latest.grade).to.equal(grade);
      expect(latest.estimatedValue).to.equal(estimatedValue);
      expect(latest.modelVersion).to.equal(modelVersion);
      expect(latest.assessmentHash).to.equal(assessmentHash);
      expect(latest.assessor).to.equal(assessor.address);

      const history = await cropAssessment.getAssessmentHistory(1);
      expect(history.length).to.equal(1);
    });

    it("Should revert if unauthorized user attempts to submit assessment", async function () {
      await expect(
        cropAssessment
          .connect(unauthorizedUser)
          .submitAssessment(1, qualityScore, grade, estimatedValue, modelVersion, assessmentHash)
      ).to.be.revertedWithCustomError(cropAssessment, "UnauthorizedCaller");
    });

    it("Should revert if qualityScore exceeds 100", async function () {
      await expect(
        cropAssessment
          .connect(assessor)
          .submitAssessment(1, 101, grade, estimatedValue, modelVersion, assessmentHash)
      ).to.be.revertedWithCustomError(cropAssessment, "InvalidQualityScore");
    });

    it("Should revert if assessmentHash is zero bytes", async function () {
      await expect(
        cropAssessment
          .connect(assessor)
          .submitAssessment(1, qualityScore, grade, estimatedValue, modelVersion, ethers.ZeroHash)
      ).to.be.revertedWithCustomError(cropAssessment, "InvalidAssessmentHash");
    });

    it("Should revert if cropId does not exist", async function () {
      await expect(
        cropAssessment
          .connect(assessor)
          .submitAssessment(999, qualityScore, grade, estimatedValue, modelVersion, assessmentHash)
      ).to.be.revertedWithCustomError(cropAssessment, "CropDoesNotExist");
    });
  });
});
