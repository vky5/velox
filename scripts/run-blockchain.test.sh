#!/bin/bash

# start harhdat blockchain
npx hardnat node  & # saying that we want to run the hardhat node in the background

# wait for the node to be ready
sleep 5

# clean previous build files
npx hardhat clean
rm -rf artifacts cache

#deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# check if it is working
npx hardhat run scripts/interact.js --network localhost
