require("dotenv").config();
// const axios = require("axios");
const { BlockNumController } = require("../controllers/blocknum");

const {
    multicallProvider,
    getNFTContract_m,
    provider,
} = require("../contracts");
const { manageNFTs } = require("../controllers/blockchain");
const { AddressController } = require("../controllers/addresses");
// const { fromBigNum } = require("../utils");

const handleSync = async () => {
    try {
        // const totalSupplyArray = [];
        // let promiseArray = [];
        // let metadataArray = {};
        // let ownerArray = {};
        // let creatorArray = {};

        /** Get NFT Addresses */
        const addresses = await AddressController.getAddresses({ id: 1 });

        /* Get TotalSupply per NFT */
        // multicallProvider.init();
        // for (let i = 0; i < addresses.length; i++) {
        //     const NFTcontract_m = getNFTContract_m(addresses[i]);
        //     promiseArray.push(NFTcontract_m.totalSupply());
        // }
        // const bigNumResultArray = await multicallProvider.all(promiseArray);
        // bigNumResultArray.map((item) => {
        //     totalSupplyArray.push(fromBigNum(item, 0));
        // });

        /* Get TotalNFTTokens per NFT */
        // multicallProvider.init();
        // for (let i = 0; i < addresses.length; i++) {
        //     // Get All tokenURIs from Contract
        //     promiseArray = [];
        //     const NFTcontract_m = getNFTContract_m(addresses[i]);
        //     for (let j = 0; j < Number(totalSupplyArray[i]); j++) {
        //         promiseArray.push(NFTcontract_m.tokenURI(j));
        //     }
        //     const resultArray = await multicallProvider.all(promiseArray);

        //     // Get ALl metadata from IPFS
        //     promiseArray = [];
        //     for (let j = 0; j < resultArray.length; j++) {
        //         promiseArray.push(
        //             axios.get(process.env.IPFS_BASEURL + resultArray[j])
        //         );
        //     }
        //     let hashbump = await Promise.all(promiseArray);
        //     let jsonbump = [];
        //     hashbump.map((item) => {
        //         jsonbump.push(item.data);
        //     });

        //     /* All NFTs metadata */
        //     metadataArray = {
        //         ...metadataArray,
        //         ["nft" + (i + 1)]: jsonbump,
        //     };
        // }

        /** Get NFTs Owners */
        // multicallProvider.init();
        // for (let i = 0; i < addresses.length; i++) {
        //     promiseArray = [];
        //     let promiseArray1 = [];
        //     const NFTcontract_m = getNFTContract_m(addresses[i]);
        //     for (let j = 0; j < totalSupplyArray[i]; j++) {
        //         promiseArray.push(NFTcontract_m.ownerOf(j));
        //         promiseArray1.push(NFTcontract_m.creatorOf(j));
        //     }
        //     let bump = await multicallProvider.all(promiseArray);
        //     let bump1 = await multicallProvider.all(promiseArray1);
        //     ownerArray = {
        //         ...ownerArray,
        //         ["nft" + (i + 1)]: bump,
        //     };
        //     creatorArray = {
        //         ...creatorArray,
        //         ["nft" + (i + 1)]: bump1,
        //     };
        // }

        /** Save All NFTs Data */
        // await manageNFTs.updateAllNFTs({
        //     dataArray: metadataArray,
        //     creatorArray: creatorArray,
        //     ownerArray: ownerArray,
        //     totalSupplyArray: totalSupplyArray,
        // });

        await manageNFTs.updateAllNFTs();

        // Update Block Number
        let currentBlockNumber = await provider.getBlockNumber();
        for (let i = 0; i < addresses.length; i++) {
            await BlockNumController.update({
                id: addresses[i],
                latestBlock: currentBlockNumber,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = { handleSync };
