const ethers = require("ethers");

// setting up the url for the
const provider = new ethers.JsonRpcApiProvider(
  process.env.BLOCkCHAIN_URL + ":" + process.env.BLOCkCHAIN_PORT
);

// Load Wallet (Use Hardhat's test account or environment variable)
const privateKey =
  process.env.PRIVATE_KEY || "0xYOUR_HARDHAT_TEST_ACCOUNT_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);

// Load Deployed Contract ABI & Address
const contractABI = require("./devFiles/GPSLogistics.json").abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// Create Contract Instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = { provider, wallet, contract };
