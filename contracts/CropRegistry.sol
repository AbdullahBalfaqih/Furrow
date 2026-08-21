// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/ICropRegistry.sol";
import "./FurrowAccessControl.sol";

/**
 * @title CropRegistry
 * @notice Registers and manages agricultural crop lots for smallholder farmers.
 * @dev Stores light decentralized storage references (0G Storage CID and metadata hashes) instead of heavy raw files.
 */
contract CropRegistry is ICropRegistry {
    FurrowAccessControl public immutable accessControl;

    uint256 private _nextCropId;
    mapping(uint256 => Crop) private _crops;

    error CropDoesNotExist(uint256 cropId);
    error UnauthorizedCaller();
    error EmptyCropType();
    error EmptyStorageCID();
    error InvalidMetadataHash();
    error InvalidHarvestDate();
    error ZeroAddressProvided();

    modifier onlyAdmin() {
        if (!accessControl.isAdmin(msg.sender)) revert UnauthorizedCaller();
        _;
    }

    modifier onlyFarmerOrAdmin(uint256 cropId) {
        if (_crops[cropId].farmer == address(0)) {
            revert CropDoesNotExist(cropId);
        }
        if (_crops[cropId].farmer != msg.sender && !accessControl.isAdmin(msg.sender)) {
            revert UnauthorizedCaller();
        }
        _;
    }

    modifier onlyAuthorizedStatusUpdater(uint256 cropId) {
        if (_crops[cropId].farmer == address(0)) revert CropDoesNotExist(cropId);
        bool isFarmer = _crops[cropId].farmer == msg.sender;
        bool isMarketplace = accessControl.isMarketplace(msg.sender);
        bool isAdminUser = accessControl.isAdmin(msg.sender);
        if (!isFarmer && !isMarketplace && !isAdminUser) {
            revert UnauthorizedCaller();
        }
        _;
    }

    constructor(address accessControlAddress) {
        if (accessControlAddress == address(0)) revert ZeroAddressProvided();
        accessControl = FurrowAccessControl(accessControlAddress);
        _nextCropId = 1;
    }

    /**
     * @notice Registers a new crop lot onchain.
     * @param cropType Type/variety of the crop (e.g. "Sukari Dates", "Organic Tomatoes").
     * @param storageCID 0G Storage CID referencing crop metadata & imagery.
     * @param metadataHash Cryptographic SHA256/Keccak hash of metadata JSON.
     * @param harvestDate Timestamp of harvest.
     * @return cropId Generated unique crop ID.
     */
    function registerCrop(
        string calldata cropType,
        string calldata storageCID,
        bytes32 metadataHash,
        uint256 harvestDate
    ) external override returns (uint256) {
        if (bytes(cropType).length == 0) revert EmptyCropType();
        if (bytes(storageCID).length == 0) revert EmptyStorageCID();
        if (metadataHash == bytes32(0)) revert InvalidMetadataHash();
        if (harvestDate == 0 || harvestDate > block.timestamp + 30 days) revert InvalidHarvestDate();

        uint256 cropId = _nextCropId++;

        Crop memory newCrop = Crop({
            id: cropId,
            farmer: msg.sender,
            cropType: cropType,
            storageCID: storageCID,
            metadataHash: metadataHash,
            harvestDate: harvestDate,
            createdAt: block.timestamp,
            status: CropStatus.Registered
        });

        _crops[cropId] = newCrop;

        emit CropRegistered(
            cropId,
            msg.sender,
            cropType,
            storageCID,
            metadataHash,
            harvestDate
        );

        return cropId;
    }

    /**
     * @notice Fetch crop struct by ID.
     */
    function getCrop(uint256 cropId) external view override returns (Crop memory) {
        if (_crops[cropId].farmer == address(0)) revert CropDoesNotExist(cropId);
        return _crops[cropId];
    }

    /**
     * @notice Update storage CID and metadata hash for an existing crop lot.
     * @dev Restricted to the crop farmer or system Admin.
     */
    function updateCropMetadata(
        uint256 cropId,
        string calldata storageCID,
        bytes32 metadataHash
    ) external override onlyFarmerOrAdmin(cropId) {
        if (bytes(storageCID).length == 0) revert EmptyStorageCID();
        if (metadataHash == bytes32(0)) revert InvalidMetadataHash();

        _crops[cropId].storageCID = storageCID;
        _crops[cropId].metadataHash = metadataHash;

        emit CropMetadataUpdated(cropId, storageCID, metadataHash);
    }

    /**
     * @notice Updates status of a crop lot (Registered, Listed, Sold, Cancelled).
     * @dev Callable by Farmer, Marketplace contract, or Admin.
     */
    function setCropStatus(
        uint256 cropId,
        CropStatus status
    ) external override onlyAuthorizedStatusUpdater(cropId) {
        _crops[cropId].status = status;
        emit CropStatusUpdated(cropId, status);
    }

    /**
     * @notice Utility function to check if a crop exists.
     */
    function exists(uint256 cropId) external view override returns (bool) {
        return _crops[cropId].farmer != address(0);
    }

    /**
     * @notice Returns total number of registered crops.
     */
    function getTotalCrops() external view returns (uint256) {
        return _nextCropId - 1;
    }
}
