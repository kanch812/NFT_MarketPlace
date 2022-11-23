const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
const { BigNumber } = require("ethers")


describe("Check different functions...", function () {
    // deploying the contract   
    let NFTMarketplace, marketPlace
    beforeEach("deployment test", async function () {
        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        marketPlace = await NFTMarketplace.deploy()
        await marketPlace.deployed()

    })
    it(" it should get the name", async function () {
        expect(await marketPlace.name()).to.equal("NFTMarketplace")
        console.log(" deployed at:", marketPlace.address)
    })

    it("It should get the symbol ", async function () {
        expect(await marketPlace.symbol()).to.equal("NMP")
    })


    it("Should check the listingPrice", async function () {
        const listingPrice = BigNumber.from(await marketPlace.getListingPrice())
        const value = BigNumber.from(ethers.utils.parseEther('0.00025'))
        expect(listingPrice).to.equal(value)
    })

})

describe(" Changing listing price function. ",  function(){

    let NFTMarketplace, marketPlace, signerAccount1, signerAccount2
    beforeEach("deploying contract here... ", async function (){
     NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
     marketPlace = await NFTMarketplace.deploy()
    await marketPlace.deployed()
    signerAccount1 = ethers.provider.getSigner(0)
    [signerAccount2] = await ethers.provider.listAccounts()
    
    })

    it("Checking that only owner changes the value pf listing price", async function(){
        const price = BigNumber.from(await ethers.utils.parseEther("0.0001"))
        assert.equal(await marketPlace.updateListingPrice(price), signerAccount1)
    })
})