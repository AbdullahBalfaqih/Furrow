// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IFurrowMarketplace.sol";
import "./interfaces/ICropRegistry.sol";
import "./FurrowAccessControl.sol";

/**
 * @title FurrowMarketplace
 * @notice Decentralized crop listing and competitive bidding marketplace using native 0G token payments.
 * @dev Protects against reentrancy, self-buying, double withdrawal, expired offers, and unauthorized state changes.
 */
contract FurrowMarketplace is IFurrowMarketplace, ReentrancyGuard {
    FurrowAccessControl public immutable accessControl;
    ICropRegistry public immutable cropRegistry;

    uint256 private _nextListingId;
    uint256 private _nextOfferId;

    mapping(uint256 => Listing) private _listings;
    mapping(uint256 => Offer) private _offers;
    mapping(uint256 => uint256[]) private _listingOfferIds;

    error ZeroAddressProvided();
    error UnauthorizedCaller();
    error CropDoesNotExist(uint256 cropId);
    error CropNotRegisteredStatus(uint256 cropId);
    error ListingDoesNotExist(uint256 listingId);
    error ListingNotActive(uint256 listingId);
    error ListingExpired(uint256 listingId);
    error OfferDoesNotExist(uint256 offerId);
    error OfferNotActive(uint256 offerId);
    error OfferMismatch(uint256 offerId, uint256 listingId);
    error MinimumPriceNotMet(uint256 sentAmount, uint256 minimumPrice);
    error SelfBuyingNotAllowed();
    error InvalidExpirationTime();
    error InvalidPrice();
    error TransferFailed();

    modifier onlyListingFarmer(uint256 listingId) {
        if (!_listings[listingId].active && _listings[listingId].farmer == address(0)) {
            revert ListingDoesNotExist(listingId);
        }
        if (_listings[listingId].farmer != msg.sender && !accessControl.isAdmin(msg.sender)) {
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
        _nextListingId = 1;
        _nextOfferId = 1;
    }

    /**
     * @notice Creates a new marketplace listing for a registered crop lot.
     * @param cropId Registered crop ID owned by msg.sender.
     * @param minimumPrice Minimum acceptable bid price in native 0G wei.
     * @param expiresAt Unix timestamp when the listing automatically expires.
     * @return listingId Generated listing ID.
     */
    function createListing(
        uint256 cropId,
        uint256 minimumPrice,
        uint256 expiresAt
    ) external override returns (uint256) {
        if (!cropRegistry.exists(cropId)) revert CropDoesNotExist(cropId);

        ICropRegistry.Crop memory crop = cropRegistry.getCrop(cropId);
        if (crop.farmer != msg.sender && !accessControl.isAdmin(msg.sender)) {
            revert UnauthorizedCaller();
        }
        if (crop.status != ICropRegistry.CropStatus.Registered) {
            revert CropNotRegisteredStatus(cropId);
        }
        if (minimumPrice == 0) revert InvalidPrice();
        if (expiresAt <= block.timestamp) revert InvalidExpirationTime();

        uint256 listingId = _nextListingId++;

        Listing memory newListing = Listing({
            listingId: listingId,
            cropId: cropId,
            farmer: crop.farmer,
            minimumPrice: minimumPrice,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            active: true
        });

        _listings[listingId] = newListing;

        // Update Crop status in CropRegistry
        cropRegistry.setCropStatus(cropId, ICropRegistry.CropStatus.Listed);

        emit ListingCreated(listingId, cropId, crop.farmer, minimumPrice, expiresAt);

        return listingId;
    }

    /**
     * @notice Cancels an active listing and sets crop status back to Registered.
     */
    function cancelListing(uint256 listingId) external override onlyListingFarmer(listingId) {
        Listing storage listing = _listings[listingId];
        if (!listing.active) revert ListingNotActive(listingId);

        listing.active = false;

        cropRegistry.setCropStatus(listing.cropId, ICropRegistry.CropStatus.Registered);

        emit ListingCancelled(listingId, listing.cropId);
    }

    /**
     * @notice Submit a competitive buyer offer with native 0G token payment attached.
     * @param listingId Target listing ID.
     * @return offerId Generated offer ID.
     */
    function makeOffer(uint256 listingId) external payable override returns (uint256) {
        Listing memory listing = _listings[listingId];
        if (listing.farmer == address(0)) revert ListingDoesNotExist(listingId);
        if (!listing.active) revert ListingNotActive(listingId);
        if (block.timestamp >= listing.expiresAt) revert ListingExpired(listingId);
        if (msg.sender == listing.farmer) revert SelfBuyingNotAllowed();
        if (msg.value < listing.minimumPrice) {
            revert MinimumPriceNotMet(msg.value, listing.minimumPrice);
        }

        uint256 offerId = _nextOfferId++;

        Offer memory newOffer = Offer({
            offerId: offerId,
            listingId: listingId,
            buyer: msg.sender,
            amount: msg.value,
            createdAt: block.timestamp,
            active: true
        });

        _offers[offerId] = newOffer;
        _listingOfferIds[listingId].push(offerId);

        emit OfferCreated(offerId, listingId, msg.sender, msg.value);

        return offerId;
    }

    /**
     * @notice Farmer accepts a buyer's offer, executing immediate 0G payout to farmer and marking crop Sold.
     * @dev Protected with ReentrancyGuard and Checks-Effects-Interactions.
     */
    function acceptOffer(
        uint256 listingId,
        uint256 offerId
    ) external override nonReentrant onlyListingFarmer(listingId) {
        Listing storage listing = _listings[listingId];
        if (!listing.active) revert ListingNotActive(listingId);

        Offer storage offer = _offers[offerId];
        if (offer.buyer == address(0)) revert OfferDoesNotExist(offerId);
        if (!offer.active) revert OfferNotActive(offerId);
        if (offer.listingId != listingId) revert OfferMismatch(offerId, listingId);

        // Checks & Effects
        listing.active = false;
        offer.active = false;
        uint256 payoutAmount = offer.amount;
        address farmerAddress = listing.farmer;
        address buyerAddress = offer.buyer;
        uint256 cropId = listing.cropId;

        // Update Registry Status
        cropRegistry.setCropStatus(cropId, ICropRegistry.CropStatus.Sold);

        // Emit Events
        emit OfferAccepted(listingId, offerId, buyerAddress, payoutAmount);
        emit CropSold(cropId, listingId, farmerAddress, buyerAddress, payoutAmount);

        // Interactions (Safe 0G Ether transfer)
        (bool success, ) = payable(farmerAddress).call{value: payoutAmount}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Allows a buyer to safely withdraw funds from an unaccepted or cancelled/expired offer.
     * @dev Protected with ReentrancyGuard and Checks-Effects-Interactions.
     */
    function withdrawOffer(uint256 offerId) external override nonReentrant {
        Offer storage offer = _offers[offerId];
        if (offer.buyer == address(0)) revert OfferDoesNotExist(offerId);
        if (!offer.active) revert OfferNotActive(offerId);
        if (offer.buyer != msg.sender) revert UnauthorizedCaller();

        // Checks & Effects
        offer.active = false;
        uint256 refundAmount = offer.amount;
        uint256 listingId = offer.listingId;

        emit OfferWithdrawn(offerId, listingId, msg.sender, refundAmount);

        // Interactions
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Returns listing details by ID.
     */
    function getListing(uint256 listingId) external view override returns (Listing memory) {
        if (_listings[listingId].farmer == address(0)) revert ListingDoesNotExist(listingId);
        return _listings[listingId];
    }

    /**
     * @notice Returns offer details by ID.
     */
    function getOffer(uint256 offerId) external view override returns (Offer memory) {
        if (_offers[offerId].buyer == address(0)) revert OfferDoesNotExist(offerId);
        return _offers[offerId];
    }

    /**
     * @notice Returns all offers placed on a specific listing.
     */
    function getListingOffers(uint256 listingId) external view override returns (Offer[] memory) {
        uint256[] memory ids = _listingOfferIds[listingId];
        Offer[] memory offersList = new Offer[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            offersList[i] = _offers[ids[i]];
        }
        return offersList;
    }

    /**
     * @notice Returns total count of created listings.
     */
    function getTotalListings() external view returns (uint256) {
        return _nextListingId - 1;
    }
}
