const cloudinary = require("cloudinary").v2;

const NFT = require("./nfts");
const Admin = require("./admin");
const User = require("./user");
const config = require("../config");
const gasStation = require("../gasStation/api");

cloudinary.config(config.cloudinary);

const Router = (router) => {
    // NFT manage
    router.post("/lazy-mint", User.middleware, NFT.LazyMint);
    router.post("/lazy-onsale", User.middleware, NFT.LazyOnSale);
    router.post("/mint-nft", NFT.MintNFT);
    router.post("/nft-like", NFT.LikeNFT);

    // NFT Collection manage
    router.post("/create-collection", User.middleware, NFT.CreateCollection);
    router.post("/get-contractgas", User.middleware, NFT.GetCollectionGas);

    // User Auth manage
    router.post("/user-create", User.Create);
    router.post("/user-login", User.logIn);
    router.post("/user-update", User.middleware, User.updateInfo);

    // Admin Auth manage
    router.post("/admin-create", Admin.Create);
    router.post("/admin-login", Admin.Login);
    router.post("/admin-update", Admin.Update, User.updateInfo);


    // admin actions
    router.post("/admin/getFee", User.adminMiddleware, gasStation.getFee);
    router.post("/admin/setFee", User.adminMiddleware, gasStation.setAdminFee);

    // credit card
    router.post(
        "/payment/session-initiate",
        User.middleware,
        gasStation.newRequest
    );
    router.post("/payment/session-complete", gasStation.completePayment);
    router.post("/payment/request", User.middleware, gasStation.getRequests);
};

//  Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
const verify = (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payment/session-complete')) {
        req.rawBody = buf.toString();
    }
}

module.exports = { Router, verify }