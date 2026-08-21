// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FurrowAccessControl
 * @notice Centralized Role-Based Access Control system for the Furrow Chain smart contract ecosystem.
 * @dev Deployer receives DEFAULT_ADMIN_ROLE and ADMIN_ROLE. Roles control access across Registry, Assessment, and Marketplace.
 */
contract FurrowAccessControl is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ASSESSOR_ROLE = keccak256("ASSESSOR_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    event RoleGrantedCustom(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevokedCustom(bytes32 indexed role, address indexed account, address indexed sender);

    error ZeroAddressProvided();

    constructor(address rootAdmin) {
        address admin = rootAdmin == address(0) ? msg.sender : rootAdmin;
        if (admin == address(0)) revert ZeroAddressProvided();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ASSESSOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(MARKETPLACE_ROLE, ADMIN_ROLE);
    }

    /**
     * @notice Helper to check if an address has Admin privileges.
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account) || hasRole(ADMIN_ROLE, account);
    }

    /**
     * @notice Helper to check if an address has Assessor privileges.
     */
    function isAssessor(address account) external view returns (bool) {
        return hasRole(ASSESSOR_ROLE, account);
    }

    /**
     * @notice Helper to check if an address has Marketplace privileges.
     */
    function isMarketplace(address account) external view returns (bool) {
        return hasRole(MARKETPLACE_ROLE, account);
    }
}
