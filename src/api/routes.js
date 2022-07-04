const cloudinary = require("cloudinary").v2;

const NFT = require("../api/nfts");
const User = require("../api/user");
const config = require("../config");

cloudinary.config(config.cloudinary);

module.exports = (router) => {
    // Nft manage
    router.post("/lazy-mint", NFT.LazyMint);
    router.post("/mint-nft", NFT.MintNFT);
    router.post("/nft-like", NFT.LikeNFT);

    // Auth manage
    router.post("/test", User.test);
    router.post("/user-create", User.Create);
    router.post("/user-login", User.logIn);
    router.post("/user-update", User.updateInfo);
};
