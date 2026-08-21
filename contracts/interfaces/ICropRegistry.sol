// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICropRegistry {
    enum CropStatus {
        Registered,
        Listed,
        Sold,
        Cancelled
    }

    struct Crop {
        uint256 id;
        address farmer;
        string cropType;
        string storageCID;
        bytes32 metadataHash;
        uint256 harvestDate;
        uint256 createdAt;
        CropStatus status;
    }

    event CropRegistered(
        uint256 indexed cropId,
        address indexed farmer,
        string cropType,
        string storageCID,
        bytes32 metadataHash,
        uint256 harvestDate
    );

    event CropMetadataUpdated(
        uint256 indexed cropId,
        string storageCID,
        bytes32 metadataHash
    );

    event CropStatusUpdated(
        uint256 indexed cropId,
        CropStatus indexed status
    );

    function registerCrop(
        string calldata cropType,
        string calldata storageCID,
        bytes32 metadataHash,
        uint256 harvestDate
    ) external returns (uint256);

    function getCrop(uint256 cropId) external view returns (Crop memory);

    function updateCropMetadata(
        uint256 cropId,
        string calldata storageCID,
        bytes32 metadataHash
    ) external;

    function setCropStatus(
        uint256 cropId,
        CropStatus status
    ) external;

    function exists(uint256 cropId) external view returns (bool);
}
