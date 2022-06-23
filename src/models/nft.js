/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NFTmetadata = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    image: {
        type: String,
    },
    external_url: {
        type: String,
    },
    fee: {
        type: Number,
    },
    fee_recipent: {
        type: String,
    },
});

const metadata = new Schema({
    image: {
        type: String,
    },
    image_data: {
        type: String,
    },
    external_url: {
        type: String,
    },
    description: {
        type: String,
    },
    name: {
        type: String,
    },
    attributes: {
        type: Array,
    },
    background_color: {
        type: String,
    },
    animation_url: {
        type: String,
    },
    youtube_url: {
        type: String,
    },
});

const marketdata = new Schema({
    price: String,
    owner: String,
    startTime: String,
    endTime: String,
    bidder: String,
    bidPrice: String,
    prices: {
        type: Array,
    },
    owners: {
        type: Array,
    },
    bidders: {
        type: Array,
    },
    bidPrices: {
        type: Array,
    },
    bidTime: {
        type: Array,
    },
});

const item = new Schema({
    tokenID: { type: Number },
    collectionAddress: String,
    likes: { type: Array },
    creator: String,
    owner: {
        type: String,
        required: true,
    },
    metadata: metadata,
    marketdata: marketdata,
});

const NFTs = new Schema({
    nft_id: {
        type: Schema.Types.ObjectId,
    },
    address: {
        type: String,
    },
    metadata: NFTmetadata,
    items: [item],
});

module.exports = NFT = mongoose.model("nfts", NFTs);
