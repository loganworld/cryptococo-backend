const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Request Schema
const RequestSchema = new Schema(
    {
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
    },
    { timestamps: true }
);

// Price Schema
const PriceSchema = new Schema({
    ETHEURPrice: Number,
    ETHUSDPrice: Number,
    ETHJPYPrice: Number
},
    { timestamps: true }
);

const AdminSettingSchema = new Schema({
    ExchangeFee: Number
},
    { timestamps: true }
);

const ExchangeRequests = mongoose.model("ExchangeRequests", RequestSchema);
const ETHPrices = mongoose.model("ETHPrices", PriceSchema);
const AdminSettings = mongoose.model("AdminSettings", AdminSettingSchema);
module.exports = { ExchangeRequests, ETHPrices, AdminSettings }