const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");


async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const MarketPlace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketPlace = await MarketPlace.deploy();

    await marketPlace.deployed();
  
    console.log("NFT Marketplace address:", marketPlace.address); 

    //Pull the address and ABI out while you deploy, since that will be key in interacting with the smart contract later
  const data = {
    address: marketPlace.address,
    abi: JSON.parse(marketPlace.interface.format('json'))
  }

  //This writes the ABI and address to the marketplace.json
  //This data is then used by frontend files to connect with the smart contract
  fs.writeFileSync('./src/MarketPlace.json', JSON.stringify(data))
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });