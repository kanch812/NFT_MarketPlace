// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage {
    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenID;
    Counters.Counter private _itemSold;

    uint256 listingPrice = 0.00025 ether;

    constructor() ERC721("NFTMarketplace", "NMP") {
        owner = payable(msg.sender);
    }

    // modifier to be used when owner needs to be called

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    // struct to create info about NFTs

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool sold;
    }

    // mapping so that we can retrive metadata from token ID
    mapping(uint256 => ListedToken) private idOfTokenListed;

    event sellToken(
        uint256 indexed date,
        uint256 tokenId,
        address owner,
        address seller,
        uint256 price
    );

    event createNFTToken(string tokenURI, uint256 _tokenID, uint256 price);

    event cancellingToken(
        address indexed seller,
        address indexed marketPlace,
        uint256 _tokenID
    );

    // function for updating listing price of the market place
    function updateListingPrice(uint256 newPrice) public payable onlyOwner {
        //only owner can append the price
        listingPrice = newPrice;
    }

    //function to check the listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    //function to fetch the latest token id and view it from ListedToken struct
    function getLatestTokentoListedToken()
        public
        view
        returns (ListedToken memory)
    {
        // current(), which is called through counter, helps to get the latest id
        uint256 currentId = _tokenID.current();
        return idOfTokenListed[currentId];
    }

    //function to fetch the information from token id
    function getTokenIdInformation(uint256 tokenId)
        public
        view
        returns (ListedToken memory)
    {
        return idOfTokenListed[tokenId];
    }

    function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
        return idOfTokenListed[_tokenId].price;
    }

    // function to get latest token id and also the number of tokens on the platform
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenID.current();
    }

    //  function transferListingPrice( uint _listingPrice) public {
    //    _listingPrice= listingPrice;
    //  _transfer(msg.sender, address(this), _listingPrice);
    //}

    /* main functions to be included in NFT market place
    create token() creating token for the first time
    createListenToken() create object of the struct to keep track of NFTS, also updating their IDs
    getAllNft() to list all the NFTs available for sale
    getMyNft() to view all the NFTs with current user
    executeSale() to sale NFTs - transfering NFT, updating the owner, minting NFT
    */

    // function to create NFT token by the URI of it from the front containing the metadata of the same
    function createListing(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        // checking enough money sent by the lister, have  atleast listingPrice
        require(msg.value >= listingPrice, "Please send minimum listing price");
        require(price > 0, "No negative price value please!");

        _tokenID.increment();
        uint256 currentTokenId = _tokenID.current();
        _safeMint(msg.sender, currentTokenId);

        _setTokenURI(currentTokenId, tokenURI);
        createListedToken(currentTokenId, price);
        
        emit createNFTToken(tokenURI, currentTokenId, price);
        return currentTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        idOfTokenListed[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    // view function to get the NFTs , like showing all the NFTs to be sold
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenID.current(); // number of NFTs
        ListedToken[] memory tokens = new ListedToken[](nftCount); // creating array of NFT

        uint index;

        for (uint256 i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idOfTokenListed[currentId];
            tokens[index] = currentItem; // listing NFT & its data into the NFT array
            index += 1;
        }

        return tokens;
    }

    // user checking his NFT collection, Which one is brought or sold
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalNftCount = _tokenID.current();
        uint256 currentIndex;
        uint256 itemCount;

        // to count the number of nfts the user holds as a buyer or seller
        for (uint256 i = 0; i < totalNftCount; i++) {
            // checking the number of assets with the user
            if (
                idOfTokenListed[i + 1].seller == msg.sender ||
                idOfTokenListed[i + 1].owner == msg.sender
            ) {
                itemCount++;
            }
        }

        //assigning the array to keep count of user's asset
        ListedToken[] memory userItem = new ListedToken[](itemCount);
        for (uint256 i = 0; i < totalNftCount; i++) {
            if (
                idOfTokenListed[i + 1].seller == msg.sender ||
                idOfTokenListed[i + 1].owner == msg.sender
            ) {
                uint256 currentId = i + 1;
                ListedToken storage currentItem = idOfTokenListed[currentId];
                userItem[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return userItem;
    }

    // selling nft on market place

    function buyNFT(uint256 tokenId) public payable {
        // checking that user have sufficient funds to buy the NFT
        uint256 tokenPrice = idOfTokenListed[tokenId].price;
        require(
            msg.value >= tokenPrice,
            "Please add sufficient funds to buy NFT"
        );
        address payable seller = idOfTokenListed[tokenId].seller;

        idOfTokenListed[tokenId].sold = true;
      
        idOfTokenListed[tokenId].owner = payable(msg.sender);
       // transferFrom(address(this), seller, tokenId);
       _transfer(address(this), msg.sender, tokenId);

        //payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);
        emit sellToken(block.timestamp, tokenId, owner, seller, msg.value);
        seller = payable(address(0));
      
        _itemSold.increment();
    }

    // cancel listing function  - tranfer from address.this to msg.sender & require ( only seller can call the contract)
    // looking from approval modal
    function cancelListing(uint256 _tokenId) public {
        address seller = idOfTokenListed[_tokenId].seller;
        require(msg.sender == seller, "Only owner of the token can delist! ");
        _transfer(address(this), seller, _tokenId);
        idOfTokenListed[_tokenId].seller = payable(address(0));
        idOfTokenListed[_tokenId].owner = payable(msg.sender);
        emit cancellingToken(seller, address(this), _tokenId);
    }

    //resell function
    function resellNft(uint256 tokenId, uint256 price) public payable {
        require(
            idOfTokenListed[tokenId].owner == msg.sender,
            "Only the owner of nft can sell his nft"
        );
        require(msg.value == listingPrice, "Must be equal to listing price");
        idOfTokenListed[tokenId].sold = false;
        idOfTokenListed[tokenId].price = price;
        idOfTokenListed[tokenId].seller = payable(msg.sender);
        idOfTokenListed[tokenId].owner = payable(address(this));
        _itemSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }
}
