require("dotenv").config();
const ipfsAPI = require("ipfs-api");
const bs58 = require("bs58");
const ipfs = ipfsAPI(process.env.IPFS_HOST, process.env.IPFS_PORT, {
    protocol: process.env.IPFS_OPT,
});
const {
    nftControl,
    manageNFTs,
    BlockNumController,
    AddressController,
} = require("../controllers");
const { contractDeploy, provider, getNFTContract } = require("../contracts");
const { sign, getSigner, toBigNum, handleEvent } = require("../utils/utils");
const addresses = require("../contracts/contracts/addresses.json");
const { newHandler } = require("../blockchainApis/handleEvent");

module.exports = {
    MintNFT: async (req, res) => {
        try {
            const {
                name,
                extlink1,
                extlink2,
                extlink3,
                extlink4,
                desc,
                attribute,
            } = req.body;
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
                    external_url1: extlink1,
                    external_url2: extlink2,
                    external_url3: extlink3,
                    external_url4: extlink4,
                    description: desc,
                    name: name,
                    attributes: attr,
                };

                let bufferfile = Buffer.from(JSON.stringify(metadata));
                ipfs.files.add(bufferfile, function (err, file) {
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
            const {
                name,
                extlink1,
                extlink2,
                extlink3,
                extlink4,
                desc,
                attribute,
            } = req.body;
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
                    external_url1: extlink1,
                    external_url2: extlink2,
                    external_url3: extlink3,
                    external_url4: extlink4,
                    description: desc,
                    name: name,
                    attributes: attr,
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
                        isOffchain: true,
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
            const { nftAddress, assetId, priceGwei, expiresAt } = req.body;

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
                _priceInWei: priceGwei,
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
    CreateCollection: async (req, res) => {
        const { name, extUrl, desc, fee } = req.body;

        try {
            let [logoResult] = await ipfs.files.add(req.files.logoImage.data);
            let [bannerResult] = await ipfs.files.add(
                req.files.bannerImage.data
            );

            var logoImage = process.env.IPFS_BASEURL + logoResult.hash;
            var bannerImage = process.env.IPFS_BASEURL + bannerResult.hash;

            var newContract = await contractDeploy({
                privateKey: req.user.privateKey,
                name: req.user.name,
            });

            console.log("new contract: ", newContract.address);

            const check = await nftControl.findCollection({
                collectionAddress: newContract.address,
            });

            if (check) {
                return res.json({
                    success: false,
                    msg: "contract already exist",
                });
            }

            await AddressController.create({ newAddress: newContract.address });

            const result = await nftControl.createCollection({
                bannerImage: bannerImage,
                logoImage: logoImage,
                collectionAddress: newContract.address,
                name: name,
                extUrl: extUrl,
                desc: desc,
                fee: fee,
                fee_recipent: req.user.address,
            });

            if (result) {
                res.json({
                    success: true,
                });

                handleEvent({
                    id: newContract.address,
                    provider: provider,
                    contract: getNFTContract(newContract.address),
                    event: "Transfer",
                    times: 15,
                    handler: newHandler,
                    BlockNumController: BlockNumController,
                });
                console.log("create new handle process");
            }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                msg: "server error",
            });
        }
    },
};
