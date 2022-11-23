const { ethers } = require ("hardhat")
const {expect} = require("chai")


describe("Check listing", function () {
    // deploying the contract   
let NFTMarketplace, marketPlace
    before("deployment test", async function () {
         NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
         marketPlace = await NFTMarketplace.deploy()
        await marketPlace.deployed()  
        
    })
    it(" it should get the name", async function (){
        expect( await marketPlace.name()).to.equal("NFTMarketplace")
        console.log(" deployed at:", marketPlace.address)
    })


    it("Should check the listingPrice", async function() {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const marketPlace = await NFTMarketplace.deploy()
    await marketPlace.deployed()

    console.log('deployed as...', marketPlace.address )

    const listingPrice = await marketPlace.getListingPrice()
    //const value = ethers.utils.parseEther('0.00025')
    expect ( await listingPrice).toString.to.equal('0.00025')

})
})