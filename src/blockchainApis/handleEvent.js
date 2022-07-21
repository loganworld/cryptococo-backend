require("dotenv").config();
const {
    provider,
    getNFTContract,
    marketplaceContract,
    lazyNFTContract,
} = require("../contracts");
const { manageNFTs, manageOrder } = require("../controllers/blockchain");
const { AddressController } = require("../controllers/addresses");
const { fromBigNum } = require("../utils");
const { handleEvent } = require("../utils/utils");
const { BlockNumController } = require("../controllers/blocknum");
const { ethers } = require("ethers");
const axios = require("axios");
const contractAddresses = require("../contracts/contracts/addresses.json");

const handleTransation = async () => {
    try {
        const handler = async (tx, id) => {
            try {
                let txData = {
                    from: tx.args.from,
                    to: tx.args.to,
                    tokenId:
                        id !== contractAddresses.StoreFront
                            ? fromBigNum(tx.args.tokenId, 0)
                            : tx.args.tokenId,
                };

                if (txData.from === ethers.constants.AddressZero) {
                    if (id !== contractAddresses.StoreFront) {
                        const contract = getNFTContract(id);
                        const tokenUri = await contract.tokenURI(
                            txData.tokenId
                        );

                        console.log(process.env.IPFS_BASEURL + tokenUri);
                        const metadata = await axios.get(
                            process.env.IPFS_BASEURL + tokenUri
                        );

                        await manageNFTs.createNFT({
                            tokenId: txData.tokenId,
                            contractAddress: id,
                            ownerAddress: txData.to,
                            metadata: metadata.data,
                        });
                        console.log("detect new NFT");
                    }
                } else {
                    await manageNFTs.updateOwner({
                        contractAddress: id,
                        tokenId: txData.tokenId,
                        newAddress: txData.to,
                    });
                    console.log("detect NFT update - transfer");
                }
                if (tx.event === "Transfer") {
                    console.log("Transfer ", txData);
                    const marketAddress = await AddressController.getAddresses({
                        id: 2,
                    });

                    if (txData.to == marketAddress) {
                        //market data update
                        let marketdata =
                            await marketplaceContract.orderByAssetId(
                                id,
                                txData.tokenId
                            );
                        console.log(
                            "detect NFT update - market list",
                            id,
                            txData.tokenId,
                            marketdata,
                            marketdata.price
                        );
                        await manageOrder.createOrder({
                            assetOwner: marketdata.seller,
                            collectionAddress: marketdata.nftAddress,
                            assetId: txData.tokenId,
                            price: fromBigNum(marketdata.price),
                            acceptedToken: marketdata.acceptedToken,
                            expiresAt: marketdata.expiresAt,
                            marketAddress: marketAddress,
                        });
                    }
                } else if (tx.event === "BidCreated") {
                    let txData = {
                        collectionAddress: tx.args.nftAddress,
                        assetId: fromBigNum(tx.args.assetId, 0),
                        bidder: tx.args.bidder,
                        price: fromBigNum(tx.args.priceInWei, 18),
                        expiresAt: fromBigNum(tx.args.expiresAt, 0),
                    };

                    manageOrder
                        .placeBid({
                            collectionAddress: txData.collectionAddress,
                            assetId: txData.assetId,
                            bidder: txData.bidder,
                            price: txData.price,
                            expiresAt: txData.expiresAt,
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
            const addresses = await AddressController.getAddresses({ id: 1 });
            const marketplace = await AddressController.getAddresses({ id: 2 });

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
                    contract:
                        addresses[i] !== contractAddresses.StoreFront
                            ? getNFTContract(addresses[i])
                            : lazyNFTContract,
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

const newHandler = async (tx, id) => {
    try {
        let txData = {
            from: tx.args.from,
            to: tx.args.to,
            tokenId:
                id !== contractAddresses.StoreFront
                    ? fromBigNum(tx.args.tokenId, 0)
                    : tx.args.tokenId,
        };

        if (txData.from === ethers.constants.AddressZero) {
            if (id !== contractAddresses.StoreFront) {
                const contract = getNFTContract(id);
                const tokenUri = await contract.tokenURI(txData.tokenId);

                console.log(process.env.IPFS_BASEURL + tokenUri);
                const metadata = await axios.get(
                    process.env.IPFS_BASEURL + tokenUri
                );

                await manageNFTs.createNFT({
                    tokenId: txData.tokenId,
                    contractAddress: id,
                    ownerAddress: txData.to,
                    metadata: metadata.data,
                });
                console.log("detect new NFT");
            }
        } else {
            await manageNFTs.updateOwner({
                contractAddress: id,
                tokenId: txData.tokenId,
                newAddress: txData.to,
            });
            console.log("detect NFT update - transfer");
        }
        if (tx.event === "Transfer") {
            console.log("Transfer ", txData);
            const marketAddress = await AddressController.getAddresses({
                id: 2,
            });

            if (txData.to == marketAddress) {
                //market data update
                let marketdata = await marketplaceContract.orderByAssetId(
                    id,
                    txData.tokenId
                );
                console.log(
                    "detect NFT update - market list",
                    id,
                    txData.tokenId,
                    marketdata,
                    marketdata.price
                );
                await manageOrder.createOrder({
                    assetOwner: marketdata.seller,
                    collectionAddress: marketdata.nftAddress,
                    assetId: txData.tokenId,
                    price: fromBigNum(marketdata.price),
                    acceptedToken: marketdata.acceptedToken,
                    expiresAt: marketdata.expiresAt,
                    marketAddress: marketAddress,
                });
            }
        } else if (tx.event === "BidCreated") {
            let txData = {
                collectionAddress: tx.args.nftAddress,
                assetId: fromBigNum(tx.args.assetId, 0),
                bidder: tx.args.bidder,
                price: fromBigNum(tx.args.priceInWei, 18),
                expiresAt: fromBigNum(tx.args.expiresAt, 0),
            };

            manageOrder
                .placeBid({
                    collectionAddress: txData.collectionAddress,
                    assetId: txData.assetId,
                    bidder: txData.bidder,
                    price: txData.price,
                    expiresAt: txData.expiresAt,
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

module.exports = { handleTransation, newHandler };
