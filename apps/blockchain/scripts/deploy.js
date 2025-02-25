const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`🚀 Deploying contract with the account: ${deployer.address}`);

    const GPSLogistics = await hre.ethers.getContractFactory("GPSLogistics");
    const contract = await GPSLogistics.deploy(); // ✅ FIX: Remove `.deployed()`
    await contract.waitForDeployment(); // ✅ FIX: Use `waitForDeployment()`

    console.log(`✅ GPSLogistics deployed at: ${await contract.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
