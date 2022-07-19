require("dotenv").config();
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI(process.env.IPFS_HOST, process.env.IPFS_PORT, {
    protocol: process.env.IPFS_OPT,
});
const { nftControl } = require("../controllers/nft");
const { manageNFTs } = require("../controllers/blockchain");
const bs58 = require("bs58");
const addresses = require("../contracts/contracts/addresses.json");
const { sign, getSigner } = require("../utils/utils");
const { toBigNum } = require("../utils/utils");

const NFTModel = require("../models/nft");

module.exports = {
    MintNFT: async (req, res) => {
        try {
            const { name, extlink, desc, attribute } = req.body;
            ipfs.files.add(req.files.image.data, function (err, file) {
                if (err || file === undefined) {
                    throw new Error("ipfs error");
                }
                let imageUrl = file[0].hash;

                let attr = [];
                let attrJSON = JSON.parse(attribute);
                for (let x in attrJSON) {
                    if (
                        attrJSON[x].key.trim() !== "" &&
                        attrJSON[x].value.trim() !== ""
                    ) {
                        attr.push(attrJSON[x]);
                    } else {
                        break;
                    }
                }

                const metadata = {
                    image: process.env.IPFS_BASEURL + imageUrl,
                    external_url: extlink,
                    description: desc,
                    name: name,
                    attributes: attr,
                    background_color: "white",
                    animation_url: "",
                    youtube_url: "",
                };

                let bufferfile = Buffer.from(JSON.stringify(metadata));
                ipfs.files.add(bufferfile, function (err, file) {
                    if (err || file === undefined) {
                        throw new Error("ipfs error");
                    }
                    let nftUrl = file[0].hash;
                    res.json({
                        success: true,
                        url: nftUrl,
                    });
                });
            });
        } catch (err) {
            console.log(err.message);
            return res.json({
                success: false,
            });
        }
    },
    LikeNFT: async (req, res) => {
        try {
            const { tokenId, collectAddress, currentAddress } = req.body;

            const result = await nftControl.update({
                id: tokenId,
                collection: collectAddress,
                currentAddress: currentAddress,
            });

            console.log(result);

            if (result) {
                res.json({
                    success: true,
                });
            } else {
                res.json({
                    success: false,
                    msg: "database error",
                });
            }
        } catch (err) {
            console.log(err.message);
            return res.json({
                success: false,
                msg: "server error",
            });
        }
    },
    LazyMint: async (req, res) => {
        try {
            const { name, extlink, desc, attribute } = req.body;
            ipfs.files.add(req.files.image.data, function (err, file) {
                if (err || file === undefined) {
                    throw new Error("ipfs error");
                }
                let imageUrl = file[0].hash;

                let attr = [];
                let attrJSON = JSON.parse(attribute);
                for (let x in attrJSON) {
                    if (
                        attrJSON[x].key.trim() !== "" &&
                        attrJSON[x].value.trim() !== ""
                    ) {
                        attr.push(attrJSON[x]);
                    } else {
                        break;
                    }
                }

                const metadata = {
                    image: process.env.IPFS_BASEURL + imageUrl,
                    external_url: extlink,
                    description: desc,
                    name: name,
                    attributes: attr,
                    background_color: "white",
                    animation_url: "",
                    youtube_url: "",
                };

                let bufferfile = Buffer.from(JSON.stringify(metadata));
                ipfs.files.add(bufferfile, async (err, file) => {
                    if (err || file === undefined) {
                        throw new Error("ipfs error");
                    }
                    const bytes = bs58.decode(file[0].hash);
                    const hex = Buffer.from(bytes).toString("hex");
                    tokenId = "0x" + hex.slice(4);

                    let result = await manageNFTs.createNFT({
                        contractAddress: addresses.StoreFront,
                        ownerAddress: req.user.address,
                        metadata: metadata,
                        tokenId: tokenId,
                    });

                    if (result) {
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: "processing error",
                        });
                    }
                });
            });
        } catch (err) {
            console.log(err.message);
            return res.json({
                success: false,
                msg: "server error",
            });
        }
    },
    LazyOnSale: async (req, res) => {
        try {
            const { nftAddress, assetId, price, expiresAt } = req.body;

            const correctNFT = await nftControl.findNFT({
                collectionAddress: nftAddress,
                id: assetId,
            });

            if (correctNFT.items[0].owner !== req.user.address) {
                throw new Error("nft owner invalid");
            }

            const signer = await getSigner({ privateKey: req.user.privateKey });

            var onSaleData = {
                tokenId: assetId,
                owner: req.user.address,
                market: addresses.Marketplace,
                _priceInWei: toBigNum(price),
                _expiresAt: toBigNum(expiresAt, 0),
                signer: signer,
            };
            var signature = await sign(onSaleData);

            res.json({
                success: true,
                result: signature,
            });
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                msg: "server error",
            });
        }
    },
    test: async (req, res) => {
        const { contractAddress, tokenId } = req.body;

        try {
            var result = await NFTModel.aggregate([
                { $match: { address: contractAddress } },
                {
                    $project: {
                        index: {
                            $indexOfArray: ["$items.tokenID", tokenId],
                        },
                    },
                },
            ]);

            console.log(result);

            res.json({
                result: result,
            });
        } catch (err) {
            console.log(err);
        }
    },
};
