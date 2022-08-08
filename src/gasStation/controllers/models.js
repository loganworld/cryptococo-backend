const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Request Schema
const RequestSchema = new Schema({
    amount: {
        type: String,
    },
    price: {
        type: String
    },
    status: {
        type: String,
        default: "onProcessing" // onProcessing, success, failed, rejected
    },
    timestamps: true
});

const PriceSchema = new Schema({
    BNBEURPrice: Number,
    BNBUSDPrice: Number,
    BNBJPYPrice: Number
});

const ExchangeRequests = mongoose.model("ExchangeRequests", RequestSchema);
const BNBPrices = mongoose.model("BNBPrices", PriceSchema);
module.exports = { ExchangeRequests, BNBPrices }