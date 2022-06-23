require("dotenv").config();
const {
    provider,
    getNFTContract,
    marketplaceContract,
} = require("../contracts");
const { manageNFTs, manageOrder } = require("../controllers/blockchain");
const { fromBigNum } = require("../utils");
const { handleEvent } = require("../utils/utils");
const { BlockNumController } = require("../controllers/blocknum");
const { ethers } = require("ethers");
const axios = require("axios");

const handleTransation = async () => {
    try {
        const handler = async (tx, id) => {
            try {
                if (tx.event === "OrderCreated") {
                    let txData = {
                        orderId: tx.args.id,
                        assetOwner: tx.args.seller,
                        collectionAddress: tx.args.nftAddress,
                        assetId: fromBigNum(tx.args.assetId, 0),
                        price: fromBigNum(tx.args.priceInWei, 18),
                        expireAt: fromBigNum(tx.args.expiresAt, 0),
                    };

                    const marketAddress = await manageNFTs.getAddresses({
                        id: 2,
                    });

                    manageOrder
                        .createOrder({
                            assetOwner: txData.assetOwner,
                            collectionAddress: txData.collectionAddress,
                            assetId: txData.assetId,
                            price: txData.price,
                            expireAt: txData.expireAt,
                            marketAddress: marketAddress,
                        })
                        .then((res) => {
                            if (res)
                                console.log(
                                    "new detect sale: ",
                                    txData.orderId
                                );
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (tx.event === "Transfer") {
                    let txData = {
                        from: tx.args.from,
                        to: tx.args.to,
                        tokenId: fromBigNum(tx.args.tokenId, 0),
                    };

                    const marketAddress = await manageNFTs.getAddresses({
                        id: 2,
                    });

                    if (txData.from === ethers.constants.AddressZero) {
                        const contract = getNFTContract(id);
                        const tokenUri = await contract.tokenURI(
                            txData.tokenId
                        );
                        const metadata = await axios.get(
                            process.env.IPFS_BASEURL + tokenUri
                        )

                        manageNFTs
                            .createNFT({
                                tokenId: txData.tokenId,
                                contractAddress: id,
                                ownerAddress: txData.to,
                                metadata: metadata.data,
                            })
                            .then((res) => {
                                if (res) console.log("detect new NFT");
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else if (txData.from === marketAddress) {
                        manageNFTs
                            .updateOwner({
                                contractAddress: id,
                                tokenId: txData.tokenId,
                                newAddress: txData.to,
                            })
                            .then((res) => {
                                if (res) console.log("detect NFT update");
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                } else if (tx.event === "BidCreated") {
                    let txData = {
                        collectionAddress: tx.args.nftAddress,
                        assetId: fromBigNum(tx.args.assetId, 0),
                        bidder: tx.args.bidder,
                        price: fromBigNum(tx.args.priceInWei, 18),
                        expireAt: fromBigNum(tx.args.expiresAt, 0),
                    };

                    manageOrder
                        .placeBid({
                            collectionAddress: txData.collectionAddress,
                            assetId: txData.assetId,
                            bidder: txData.bidder,
                            price: txData.price,
                            expireAt: txData.expireAt,
                        })
                        .then((res) => {
                            if (res) console.log("successfully bid");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            } catch (err) {
                console.log("transfer handle error:", err.message);
            }
        };

        const handleStart = async () => {
            /** Get NFT Addresses */
            const addresses = await manageNFTs.getAddresses({ id: 1 });
            const marketplace = await manageNFTs.getAddresses({ id: 2 });

            handleEvent({
                id: marketplace,
                provider: provider,
                contract: marketplaceContract,
                event: "OrderCreated",
                times: 15,
                handler: handler,
                BlockNumController: BlockNumController,
            });

            handleEvent({
                id: marketplace,
                provider: provider,
                contract: marketplaceContract,
                event: "BuyCreated",
                times: 15,
                handler: handler,
                BlockNumController: BlockNumController,
            });

            handleEvent({
                id: marketplace,
                provider: provider,
                contract: marketplaceContract,
                event: "BidCreated",
                times: 15,
                handler: handler,
                BlockNumController: BlockNumController,
            });

            for (let i = 0; i < addresses.length; i++) {
                handleEvent({
                    id: addresses[i],
                    provider: provider,
                    contract: getNFTContract(addresses[i]),
                    event: "Transfer",
                    times: 15,
                    handler: handler,
                    BlockNumController: BlockNumController,
                });
            }
        };

        handleStart();
    } catch (err) {
        console.log(err);
    }
};

module.exports = { handleTransation };
