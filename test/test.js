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

            const currentTokenId = await marketPlace.createListing(tokenUri, price,{ value: ethers.utils.parseEther("0.5") })
            const updatedTokenId = await marketPlace.createListing(tokenUri1, price1, { value: ethers.utils.parseEther("0.5") })
            const latestToken = await marketPlace.getCurrentTokenId()
            console.log("The new token id",  latestToken.toString() )
            console.log("The new token id",  currentTokenId.toString() )
            const tokenPrice = BigNumber.from(await marketPlace.getTokenPrice(latestToken))
            console.log("Token price", ethers.utils.formatEther(tokenPrice))           
        })
    })

    describe("checking getAllNft function", function(){
        it(" should get all the NFTs listed on the platform", async function(){
            await marketPlace.createListing("abc", ethers.utils.parseEther("0.0001"), { value: ethers.utils.parseEther("0.5") })
            
            await marketPlace.createListing("def", ethers.utils.parseEther("0.0002"), { value: ethers.utils.parseEther("0.5") })
            
            await marketPlace.createListing("ghi", ethers.utils.parseEther("0.0003"), { value: ethers.utils.parseEther("0.5") })
            
            await marketPlace.createListing("jkl", ethers.utils.parseEther("0.0004"), { value: ethers.utils.parseEther("0.5") })
            
            await marketPlace.createListing("mno", ethers.utils.parseEther("0.0005"), { value: ethers.utils.parseEther("0.5") })
            let nfToken = await marketPlace.getAllNFTs()
            assert.equal(nfToken.length, '5')

          //  expect(await nfToken[0].sold).to.equal("false")
            assert.equal(await nfToken[0].sold, false)
            console.log(" The token price of 5rd NFT: ", ethers.utils.formatEther(nfToken[4].price))
            assert.equal(await (nfToken[2].tokenId).toString(), '3')
        })
    })
})


