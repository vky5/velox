const ethers = require("ethers");

const provider = new ethers.JsonRpcApiProvider(
  process.env.BLOCkCHAIN_URL +":"+process.env.BLOCkCHAIN_PORT
);


