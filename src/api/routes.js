const cloudinary = require("cloudinary").v2;

const NFT = require("./nfts");
const User = require("./user");
const config = require("../config");
const gasStation = require("../gasStation/api")

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

    // credit card
    router.post("/payment/session-initiate", User.middleware, gasStation.newRequest);
    router.post("/payment/session-complete", gasStation.completePayment);
    router.post("/payment/request", User.middleware, gasStation.getRequests);

    // admin actions
    router.post("/admin/getFee",User.adminMiddleware,gasStation.getFee);
    router.post("/admin/setFee",User.adminMiddleware,gasStation.setAdminFee);
};
