require("dotenv").config();
const colors = require("colors");
const NFT = require("../models/nft");
const ADDRESSES = require("../models/addresses");

const manageNFTs = {
    createNFT: async (props) => {
        try {
            const { contractAddress, ownerAddress, metadata, tokenId } = props;

            const item = {
                tokenID: tokenId,
                collectionAddress: contractAddress,
                owner: ownerAddress,
                creator: ownerAddress,
                metadata: metadata,
                marketdata: {
                    price: "",
                    owner: "",
                    startTime: "",
                    endTime: "",
                    bidder: "",
                    bidPrice: "",
                    prices: [],
                    owners: [],
                    bidders: [],
                    bidPrices: [],
                    bidTime: [],
                },
            };

            const result = await NFT.updateOne(
                { address: contractAddress },
                {
                    $push: {
                        items: item,
                    },
                }
            );

            if (!result) {
                throw new Error("Database Error");
            }

            return result;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    updateAllNFTs: async (props) => {
        try {
            // const { dataArray, ownerArray, creatorArray, totalSupplyArray } =
            //     props;

            /** Format MongoDatabase */
            // await NFT.remove();

            /** Get NFT Addresses */
            const addresses = await manageNFTs.getAddresses({ id: 1 });

            // NFT Skeleton ADD
            for (let i = 0; i < addresses.length; i++) {
                const checking = await NFT.find({ address: addresses[i] });

                if (!checking[0]) {
                    const defaultData = new NFT({
                        address: addresses[i],
                        metadata: {
                            name: "CIJ",
                            description: "CIJ default NFT collection",
                            coverImage:
                                "https://res.cloudinary.com/galaxy-digital/image/upload/v1653351729/marketplace/Background_8_egry4i.jpg",
                            image: "https://res.cloudinary.com/galaxy-digital/image/upload/v1652371143/icicbmetaverse/jatehwm95eitsdj87hhb.png",
                            external_url: "",
                            fee: "0.2",
                            fee_recipent: process.env.OWNER,
                        },
                    });
                    const saveData = await defaultData.save();

                    if (!saveData) {
                        throw new Error("Database Error");
                    }
                }
            }

            // NFT Item ADD
            // for (let i = 0; i < totalSupplyArray.length; i++) {
            //     for (let j = 0; j < Number(totalSupplyArray[i]); j++) {
            //         const item = {
            //             tokenID: j,
            //             collectionAddress: addresses[i],
            //             likes: [],
            //             creator: creatorArray["nft" + (i + 1)][j],
            //             owner: ownerArray["nft" + (i + 1)][j],
            //             metadata: dataArray["nft" + (i + 1)][j],
            //             marketdata: {
            //                 price: "",
            //                 owner: "",
            //                 startTime: "",
            //                 endTime: "",
            //                 bidder: "",
            //                 bidPrice: "",
            //                 prices: [],
            //                 owners: [],
            //                 bidders: [],
            //                 bidPrices: [],
            //                 bidTime: [],
            //             },
            //         };
            //         await NFT.updateOne(
            //             { address: addresses[i] },
            //             {
            //                 $push: {
            //                     items: item,
            //                 },
            //             }
            //         );
            //     }
            // }

            console.log(colors.green("Sync all nfts data..."));
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    updateOwner: async (props) => {
        try {
            const { contractAddress, tokenId, newAddress } = props;

            const data = await NFT.find({ address: contractAddress });
            let key = "items." + tokenId + ".owner";
            let price = "items." + tokenId + ".marketdata.price";
            let preowner = "items." + tokenId + ".marketdata.owner";
            let time = "items." + tokenId + ".marketdata.endTime";
            let bidder = "items." + tokenId + ".marketdata.bidder";
            let bidPrice = "items." + tokenId + ".marketdata.bidPrice";
            let bidders = "items." + tokenId + ".marketdata.bidders";
            let bidPrices = "items." + tokenId + ".marketdata.bidPrices";

            let owners = "items." + tokenId + ".marketdata.owners";
            let prices = "items." + tokenId + ".marketdata.prices";

            const result = await NFT.updateOne(
                { address: contractAddress },
                {
                    $set: {
                        [key]: newAddress,
                        [price]: "",
                        [preowner]: "",
                        [time]: "",
                        [bidder]: "",
                        [bidPrice]: "",
                        [bidders]: [],
                        [bidPrices]: [],
                    },
                    $push: {
                        [owners]: data[0].items[tokenId].marketdata.owner,
                        [prices]: data[0].items[tokenId].marketdata.price,
                    },
                }
            );

            if (!result) {
                throw new Error("Database Error");
            }

            return result;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    checkNFTAddress: async (props) => {
        try {
            const { address } = props;

            const result = await NFT.findOne({ address: address });

            if (result) return true;
            else return false;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    getAddresses: async (props) => {
        try {
            const { id } = props; // 1: nfts address, 2: marketplace
            const result = await ADDRESSES.find();

            if (id === 1) return result[0].nfts;
            else if (id === 2) return result[0].marketplace;
        } catch (err) {
            console.log(colors.red(err));
            return null;
        }
    },
};

const manageOrder = {
    createOrder: async (props) => {
        try {
            const {
                assetOwner,
                collectionAddress,
                assetId,
                price,
                acceptedToken,
                expiresAt
            } = props;

            let key1 = "items." + assetId + ".marketdata.price";
            let key2 = "items." + assetId + ".marketdata.acceptedToken";
            let key3 = "items." + assetId + ".marketdata.owner";
            let key4 = "items." + assetId + ".marketdata.endTime";
            const result = await NFT.updateOne(
                { address: collectionAddress },
                {
                    $set: {
                        [key1]: price,
                        [key2]: acceptedToken,
                        [key3]: assetOwner,
                        [key4]: expiresAt,
                    },
                }
            );

            if (!result) {
                throw new Error("Database Error");
            }

            return result;
        } catch (err) {
            console.log(colors.red(err));
        }
    },
    placeBid: async (props) => {
        const { collectionAddress, assetId, bidder, price, expiresAt } = props;

        let key = "items." + assetId + ".marketdata.bidder";
        let key1 = "items." + assetId + ".marketdata.bidPrice";
        let key2 = "items." + assetId + ".marketdata.bidders";
        let key3 = "items." + assetId + ".marketdata.bidPrices";
        let key4 = "items." + assetId + ".marketdata.bidTime";

        const result = await NFT.updateOne(
            { address: collectionAddress },
            {
                $set: {
                    [key]: bidder,
                    [key1]: price,
                },
                $push: {
                    [key2]: bidder,
                    [key3]: price,
                    [key4]: expiresAt,
                },
            }
        );

        if (!result) {
            throw new Error("Database Error");
        }

        return result;
    },
};

module.exports = {
    manageNFTs,
    manageOrder,
};
