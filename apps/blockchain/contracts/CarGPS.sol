// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CarGPS is Ownable {
    struct GPSData {
        uint256 timestamp;
        string encryptedLocation;
    }

    /*
        map of address as key and locations of GPSdata as array 
        it is private so that so that only contract can view this and no user can directly view the stored data


{
  "0x111...AAA": [
    { "timestamp": 1710123456, "encryptedLocation": "LocA1" },
    { "timestamp": 1710126789, "encryptedLocation": "LocA2" }
  ],
  "0x222...BBB": [
    { "timestamp": 1710156789, "encryptedLocation": "LocB1" }
  ],
  "0x333...CCC": [
    { "timestamp": 1710189012, "encryptedLocation": "LocC1" },
    { "timestamp": 1710192345, "encryptedLocation": "LocC2" },
    { "timestamp": 1710195678, "encryptedLocation": "LocC3" }
  ]
}

    */
    mapping(address => GPSData[]) private carData;
    

    event GPSUpdated(
        address indexed carOwner,
        uint256 timestamp,
        string encryptedLocation
    );


    /*
        Message.sender is the address of the wallet that called the function
        since constructor only run once the contract is deployed, the msg.sender is the deployer's wallet address
    */
    constructor() Ownable(msg.sender) {}


    /*
        storing the data in GPSData array
        memory to store data temporarily and it hides after the function execution
    */

    function storeGPSData(string memory _encryptedLocation) public {
        carData[msg.sender].push(GPSData(block.timestamp, _encryptedLocation));
        emit GPSUpdated(msg.sender, block.timestamp, _encryptedLocation);
    }

    function getLastGPSData(address owner) public view returns  (uint256 timestamp, string memory encryptedLocation) {
        require(carData[owner].length > 0, "No GPS data found for this owner");
        GPSData memory latest = carData[owner][carData[owner].length - 1];
        return (latest.timestamp, latest.encryptedLocation);
    }

    function getGPSDataAtIndex(address owner, uint256 index) public view returns (uint256 timestamp, string memory encryptedLocation) {
        require(carData[owner].length > index, "Invalid index");
        GPSData memory data = carData[owner][index];
        return (data.timestamp, data.encryptedLocation);
    }

    function getGPSDataCount(address owner) public view returns (uint256) {
        return carData[owner].length;
    }
}