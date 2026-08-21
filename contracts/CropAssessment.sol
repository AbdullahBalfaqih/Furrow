// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/ICropAssessment.sol";
import "./interfaces/ICropRegistry.sol";
import "./FurrowAccessControl.sol";

/**
 * @title CropAssessment
 * @notice Stores verifiable AI-assisted crop quality assessments and market valuations on 0G Chain.
 * @dev Only authorized AI Oracles / Assessor services with ASSESSOR_ROLE can submit assessments.
 */
contract CropAssessment is ICropAssessment {
    FurrowAccessControl public immutable accessControl;
    ICropRegistry public immutable cropRegistry;

    // Mapping from cropId to array of historical assessments
    mapping(uint256 => Assessment[]) private _assessments;

    error UnauthorizedCaller();
    error CropDoesNotExist(uint256 cropId);
    error InvalidQualityScore(uint256 score);
    error InvalidAssessmentHash();
    error EmptyGrade();
    error EmptyModelVersion();
    error NoAssessmentsFound(uint256 cropId);
    error ZeroAddressProvided();

    modifier onlyAssessor() {
        if (!accessControl.isAssessor(msg.sender) && !accessControl.isAdmin(msg.sender)) {
            revert UnauthorizedCaller();
        }
        _;
    }

    constructor(address accessControlAddress, address cropRegistryAddress) {
        if (accessControlAddress == address(0) || cropRegistryAddress == address(0)) {
            revert ZeroAddressProvided();
        }
        accessControl = FurrowAccessControl(accessControlAddress);
        cropRegistry = ICropRegistry(cropRegistryAddress);
    }

    /**
     * @notice Submit an AI quality score and market valuation for a registered crop lot.
     * @param cropId Target registered crop ID.
     * @param qualityScore AI quality score from 0 to 100.
     * @param grade Human readable grade (e.g. "Grade A+ (98.6%)").
     * @param estimatedValue AI-assisted market price valuation in 0G wei per ton / unit.
     * @param modelVersion Identifier of AI vision / evaluation model used.
     * @param assessmentHash Cryptographic hash of full raw offchain AI payload stored in 0G Storage.
     */
    function submitAssessment(
        uint256 cropId,
        uint256 qualityScore,
        string calldata grade,
        uint256 estimatedValue,
        string calldata modelVersion,
        bytes32 assessmentHash
    ) external override onlyAssessor {
        if (!cropRegistry.exists(cropId)) revert CropDoesNotExist(cropId);
        if (qualityScore > 100) revert InvalidQualityScore(qualityScore);
        if (assessmentHash == bytes32(0)) revert InvalidAssessmentHash();
        if (bytes(grade).length == 0) revert EmptyGrade();
        if (bytes(modelVersion).length == 0) revert EmptyModelVersion();

        Assessment memory newAssessment = Assessment({
            cropId: cropId,
            qualityScore: qualityScore,
            grade: grade,
            estimatedValue: estimatedValue,
            modelVersion: modelVersion,
            assessmentHash: assessmentHash,
            timestamp: block.timestamp,
            assessor: msg.sender
        });

        _assessments[cropId].push(newAssessment);

        emit AssessmentSubmitted(
            cropId,
            qualityScore,
            grade,
            estimatedValue,
            msg.sender,
            assessmentHash
        );
    }

    /**
     * @notice Returns the latest AI assessment recorded for a crop lot.
     */
    function getLatestAssessment(uint256 cropId) external view override returns (Assessment memory) {
        uint256 len = _assessments[cropId].length;
        if (len == 0) revert NoAssessmentsFound(cropId);
        return _assessments[cropId][len - 1];
    }

    /**
     * @notice Returns the complete historical log of AI assessments for a crop lot.
     */
    function getAssessmentHistory(uint256 cropId) external view override returns (Assessment[] memory) {
        return _assessments[cropId];
    }

    /**
     * @notice Returns the count of assessments for a crop.
     */
    function getAssessmentCount(uint256 cropId) external view returns (uint256) {
        return _assessments[cropId].length;
    }
}
