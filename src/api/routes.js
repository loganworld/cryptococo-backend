const cloudinary = require("cloudinary").v2;

const NFT = require("../api/nfts");
const User = require("../api/user");
const config = require("../config");

cloudinary.config(config.cloudinary);

module.exports = (router) => {
    router.post("/user-update", User.updateInfo);
    router.post("/mint-nft", NFT.MintNFT);
    router.post("/nft-like", NFT.LikeNFT);
    router.post("/test", User.test);
};
