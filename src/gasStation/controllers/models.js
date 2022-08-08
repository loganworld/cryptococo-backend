const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Request Schema
const RequestSchema = new Schema({
    userAddress: {
        type: String,
    },
    amount: {
        type: String, // eth amount
    },
    price: {
        type: String
    },
    currency: {
        type: String
    },
    status: {
        type: String,
        default: "initiate" // initiate ,pending, onprocessing, success, failed, rejected
    },
    sessionId: {
        type: String
    },
    timestamps: true
});

const PriceSchema = new Schema({
    ETHEURPrice: Number,
    ETHUSDPrice: Number,
    ETHJPYPrice: Number
});

const ExchangeRequests = mongoose.model("ExchangeRequests", RequestSchema);
const ETHPrices = mongoose.model("ETHPrices", PriceSchema);
module.exports = { ExchangeRequests, ETHPrices }