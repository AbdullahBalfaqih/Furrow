// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICropAssessment {
    struct Assessment {
        uint256 cropId;
        uint256 qualityScore;
        string grade;
        uint256 estimatedValue;
        string modelVersion;
        bytes32 assessmentHash;
        uint256 timestamp;
        address assessor;
    }

    event AssessmentSubmitted(
        uint256 indexed cropId,
        uint256 qualityScore,
        string grade,
        uint256 estimatedValue,
        address indexed assessor,
        bytes32 assessmentHash
    );

    function submitAssessment(
        uint256 cropId,
        uint256 qualityScore,
        string calldata grade,
        uint256 estimatedValue,
        string calldata modelVersion,
        bytes32 assessmentHash
    ) external;

    function getLatestAssessment(uint256 cropId) external view returns (Assessment memory);

    function getAssessmentHistory(uint256 cropId) external view returns (Assessment[] memory);
}
