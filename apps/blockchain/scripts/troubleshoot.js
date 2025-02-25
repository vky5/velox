const hre = require("hardhat");

async function main() {
  console.log("TROUBLESHOOTING SCRIPT");
  
  // Deploy a brand new contract for testing
  const CarGPS = await hre.ethers.getContractFactory("CarGPS");
  const carGPS = await CarGPS.deploy();
  await carGPS.waitForDeployment();
  
  const contractAddress = await carGPS.getAddress();
  console.log("Fresh contract deployed at:", contractAddress);
  
  const [owner] = await hre.ethers.getSigners();
  console.log("Owner address:", owner.address);
  
  // Test storage function
  console.log("\nTesting storeGPSData...");
  const tx = await carGPS.storeGPSData("TestLocation");
  await tx.wait();
  console.log("✓ Storage successful");
  
  // Call function using low-level call to debug
  console.log("\nTesting getGPSDataCount with low-level call...");
  const countCalldata = CarGPS.interface.encodeFunctionData("getGPSDataCount", [owner.address]);
  console.log("Calldata:", countCalldata);
  
  const rawResult = await owner.provider.call({
    to: contractAddress,
    data: countCalldata
  });
  console.log("Raw result:", rawResult);
  
  if (rawResult === "0x") {
    console.log("⚠️ Function returned empty data");
  } else {
    // Try to decode
    const decoded = CarGPS.interface.decodeFunctionResult("getGPSDataCount", rawResult);
    console.log("Decoded:", decoded.toString());
  }
  
  // Try with a different approach using ethers directly
  console.log("\nRetrying with direct function call...");
  try {
    const count = await carGPS.getGPSDataCount(owner.address);
    console.log("✓ Count result:", count.toString());
  } catch (error) {
    console.error("× Error:", error.message);
    
    // Check if the function exists in the contract
    console.log("\nVerifying function existence...");
    const contractCode = await owner.provider.getCode(contractAddress);
    console.log("Contract code length:", contractCode.length);
    
    // List available functions from the ABI
    console.log("\nAvailable functions in ABI:");
    for (const func of CarGPS.interface.fragments) {
      if (func.type === "function") {
        console.log(`- ${func.name}(${func.inputs.map(i => i.type).join(',')})`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });