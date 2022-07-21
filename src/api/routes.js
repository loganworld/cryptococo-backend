const cloudinary = require("cloudinary").v2;

const NFT = require("../api/nfts");
const User = require("../api/user");
const config = require("../config");

cloudinary.config(config.cloudinary);

module.exports = (router) => {
    // NFT manage
    router.post("/lazy-mint", User.middleware, NFT.LazyMint);
    router.post("/lazy-onsale", User.middleware, NFT.LazyOnSale);
    router.post("/mint-nft", NFT.MintNFT);
    router.post("/nft-like", NFT.LikeNFT);

    // NFT Collection manage
    router.post("/create-collection", User.middleware, NFT.CreateCollection);

    // Auth manage
    router.post("/user-create", User.Create);
    router.post("/user-login", User.logIn);
    router.post("/user-update", User.middleware, User.updateInfo);
};
