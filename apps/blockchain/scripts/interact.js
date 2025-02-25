const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🔗 Using account:", deployer.address);

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace this with your deployed contract address
    const contract = await ethers.getContractAt("GPSLogistics", contractAddress, deployer);

    // Register an asset
    const assetId = 1;
    const assetType = "Truck";

    console.log(`🚛 Registering asset ID: ${assetId} with type: ${assetType}...`);
    let tx = await contract.registerAsset(assetId, assetType);
    await tx.wait();
    console.log("✅ Asset registered successfully!");

    // Store GPS Data
    const newDataHash = ethers.keccak256(ethers.toUtf8Bytes("Sample GPS Data"));
    console.log(`📡 Storing GPS data for asset ID: ${assetId}...`);
    tx = await contract.storeGPSData(assetId, newDataHash);
    await tx.wait();
    console.log("✅ GPS data stored successfully!");

    // Fetch last GPS data
    console.log(`📊 Fetching last GPS data for asset ID: ${assetId}...`);
    const lastGPSData = await contract.getLastGPSData(assetId);
    console.log("✅ Last GPS Data:", lastGPSData);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
