#!/bin/bash

# start harhdat blockchain
npx hardhat node  & # saying that we want to run the hardhat node in the background

# wait for the node to be ready
sleep 5

# clean previous build files
npx hardhat clean
rm -rf artifacts cache

#deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# keeping the container running 
#tail -f /dev/null  # keep watching the blackhole of the container so that container keeps running because container stops when the entrypoint file stop its execution
wait 
