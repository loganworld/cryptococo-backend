require("dotenv").config();
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("localhost", "5001", { protocol: "http" });
const { nftControl } = require("../controllers/nft");
// const NFT = require("../models/nft");

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
};