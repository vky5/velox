// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GPSLogistics is Ownable {
    struct Asset {
        string assetType;
        bytes32 lastStoredHash;
        uint256 lastUpdated;
    }

    mapping(address => mapping(uint256 => Asset)) public assets; // owner => assetId => Asset

    event GPSUpdated(
        address indexed owner,
        uint256 assetId,
        uint256 timestamp,
        bytes32 hashedData
    );

    constructor() Ownable(msg.sender) {}

    function registerAsset(uint256 assetId, string memory assetType) public {
        require(
            bytes(assets[msg.sender][assetId].assetType).length == 0,
            "Asset already registered"
        );
        assets[msg.sender][assetId].assetType = assetType;
    }

    function storeGPSData(uint256 assetId, bytes32 hashedData) public {
        require(
            bytes(assets[msg.sender][assetId].assetType).length > 0,
            "Asset not registered"
        );
        
        // bytes32 previousHash = assets[msg.sender][assetId].lastStoredHash;
        // bytes32 newHash = keccak256(
        //     abi.encodePacked(previousHash, hashedData)
        // );


        assets[msg.sender][assetId].lastStoredHash = hashedData;
        assets[msg.sender][assetId].lastUpdated = block.timestamp;
        emit GPSUpdated(msg.sender, assetId, block.timestamp, hashedData);
    }

    function getLastGPSData(
        uint256 assetId
    ) public view returns (uint256 timestamp, bytes32 dataHash) {
        require(
            assets[msg.sender][assetId].lastUpdated > 0,
            "No data available"
        );
        return (
            assets[msg.sender][assetId].lastUpdated,
            assets[msg.sender][assetId].lastStoredHash
        );
    }
}
