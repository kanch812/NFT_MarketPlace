const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
const { BigNumber } = require("ethers")
const { TASK_COMPILE_SOLIDITY_GET_ARTIFACT_FROM_COMPILATION_OUTPUT } = require("hardhat/builtin-tasks/task-names")


describe("Check different functions...", function () {
    // deploying the contract   
    let NFTMarketplace, marketPlace, nftMarketplace, deployer, user, accounts
    beforeEach("deployment test", async function () {

        accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        user = accounts[1];
        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        marketPlace = await NFTMarketplace.deploy()
        await marketPlace.deployed()
       // nftMarketplace = NFTMarketplace.connect(deployer)
        // userNftMarketPlact = NFTMarketplace.connect(user)
    })
   
    it(" it should get the name", async function () {
        expect(await marketPlace.name()).to.equal("NFTMarketplace")
        console.log(" deployed at:", marketPlace.address)
    })

    it("It should get the symbol ", async function () {
        expect(await marketPlace.symbol()).to.equal("NMP")
    })

    it("Should update the listing price", async function () {
        const listingPrice = BigNumber.from(await marketPlace.getListingPrice())
        const updatedPrice = BigNumber.from(ethers.utils.parseEther('0.0001'))
        await marketPlace.updateListingPrice(updatedPrice)
        assert.notEqual(listingPrice, updatedPrice)
        console.log(await ethers.utils.formatEther(updatedPrice))
    })


    it("Should return the latest token information", async function () {
        const tokenid = 3
        const tokenID = await marketPlace.getCurrentTokenId()
        assert.notEqual(tokenID, tokenid)
        console.log("the current token id : ", tokenID.toString())
    })

    describe("testing createToken() function... ", function () {
        it("should check is the token created ", async function () {
            const tokenUri = "abc"
            const price = await BigNumber.from(ethers.utils.parseEther('1'))

            const tokenUri1 = "def"
            const price1 = await BigNumber.from(ethers.utils.parseEther('1'))

            const ethListingPrice = BigNumber.from(await marketPlace.getListingPrice())

            // userNftMarketPlace = NFTMarketplace.connect(user)
            // Send listing price in dai  to nft marketplace
            //await marketPlace.transfer(deployer.address,ethListingPrice)
            // await hardhatToken.transfer(addr1.address, 50);
            //const tx = await userNftMarketPlace.ethers.transfer(deployer, ethListingPrice)
            const currentTokenId = await marketPlace.createListing(tokenUri, price)
            const updatedTokenId = await marketPlace.createListing(tokenUri1, price1)
            const latestToken = await marketPlace.getCurrentTokenId()
            console.log("The new token id",  latestToken.toString() )
            const tokenPrice = BigNumber.from(await marketPlace.getTokenPrice(latestToken))
            console.log("Token price", ethers.utils.formatEther(tokenPrice))
           // console.log("The new token id",  updatedTokenId.toString() )
            const transactionHash = await user.sendTransaction({
                to: deployer.address,
                value: ethListingPrice })
            console.log("Address of user :", user.address)
            console.log("Address of deployer :", deployer.address)    
           console.log ("checking status of eth transfer", await transactionHash.toString())
           
        })
    })
})


