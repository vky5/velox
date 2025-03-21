const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Wallet Address:", deployer.address);
    console.log("Private Key:", deployer.privateKey);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
