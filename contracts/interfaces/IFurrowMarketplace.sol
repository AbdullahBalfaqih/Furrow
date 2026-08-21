// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ICropRegistry.sol";

interface IFurrowMarketplace {
    struct Listing {
        uint256 listingId;
        uint256 cropId;
        address farmer;
        uint256 minimumPrice;
        uint256 createdAt;
        uint256 expiresAt;
        bool active;
    }

    struct Offer {
        uint256 offerId;
        uint256 listingId;
        address buyer;
        uint256 amount;
        uint256 createdAt;
        bool active;
    }

    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed cropId,
        address indexed farmer,
        uint256 minimumPrice,
        uint256 expiresAt
    );

    event ListingCancelled(
        uint256 indexed listingId,
        uint256 indexed cropId
    );

    event OfferCreated(
        uint256 indexed offerId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount
    );

    event OfferAccepted(
        uint256 indexed listingId,
        uint256 indexed offerId,
        address indexed buyer,
        uint256 amount
    );

    event OfferWithdrawn(
        uint256 indexed offerId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount
    );

    event CropSold(
        uint256 indexed cropId,
        uint256 indexed listingId,
        address indexed farmer,
        address buyer,
        uint256 amount
    );

    function createListing(
        uint256 cropId,
        uint256 minimumPrice,
        uint256 expiresAt
    ) external returns (uint256);

    function cancelListing(uint256 listingId) external;

    function makeOffer(uint256 listingId) external payable returns (uint256);

    function acceptOffer(uint256 listingId, uint256 offerId) external;

    function withdrawOffer(uint256 offerId) external;

    function getListing(uint256 listingId) external view returns (Listing memory);

    function getOffer(uint256 offerId) external view returns (Offer memory);

    function getListingOffers(uint256 listingId) external view returns (Offer[] memory);
}
