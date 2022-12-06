GENERIC NFT MARKETPLACE

This project is contains a well tested smart contract, which is well tested using remixIDE, mocha and chai. The project make use of hardhat framework and also is deployed on the Goerli testnet. The project involves lazy minting and the listing price is paid to the contract owner at the time of minting the NFT. 

The contract has functionalities like:

Creating Tokens
Buying Tokens
Withfrawing the listing amount, paid to the contract owner
Cancel listing the token, bringing it down from the marketplace to the creator's address
checking the listing price
changing the listing price by the owner(only owner), etc

The command used while working on hardhat framework:
npm init
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npx hardhat
npx hardhat compile
npx hardhat test npx hardhat run scripts/deploy.js --network <network-name>
