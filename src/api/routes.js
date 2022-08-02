const cloudinary = require("cloudinary").v2;

const NFT = require("./nfts");
const Admin = require("./admin");
const User = require("./user");
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

    // User Auth manage
    router.post("/user-create", User.Create);
    router.post("/user-login", User.logIn);
    router.post("/user-update", User.middleware, User.updateInfo);

    // Admin Auth manage
    router.post("/admin-create", Admin.Create);
    router.post("/admin-login", Admin.Login);
    router.post("/admin-update", Admin.Update, User.updateInfo);
};
