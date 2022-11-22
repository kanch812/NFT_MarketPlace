const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

//checking createToken function from contract
describe(" To check whether the tokens are created or not ", function() {
    // first we need to deploy the contract to check the functionality 
    let nftMarketPlace, marketPlace
    beforeEach( async function (){
        console.log("in to the deployment")
          nftMarketPlace = await ethers.getContractFactory("NFTMarketplace")
          marketPlace = await nftMarketPlace.deploy() 
        //  await marketPlace.deployed()
    })

    it(" Checking the listing price", async function (){
        const listingPrice = await marketPlace.getListingPrice()
        const price = ethers.utils.parseEther("0.00025") 
        assert.equal(listingPrice, price)
       

    })


})