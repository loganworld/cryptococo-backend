const colors = require("colors");
const { ExchangeRequests, BNBPrices } = require("./models");

const EXRequestController = {
    createRequest: async (props) => {

    },
    completeRequest: async (props) => {

    },
    failedRequest: async (props) => {

    },
    requestStatus: async (props) => {

    }
}

const PriceController = {
    updatePrice: async (props) => {
        const { BNBEURPrice, BNBUSDPrice, BNBJPYPrice } = props;
        const prices = await BNBPrices.findOne();
        if (!prices) {
            const newPrices = new BNBPrices({
                BNBEURPrice, BNBUSDPrice, BNBJPYPrice
            });
            await newPrices.save();
        }
        else {
            prices.BNBEURPrice = BNBEURPrice;
            prices.BNBUSDPrice = BNBUSDPrice;
            prices.BNBJPYPrice = BNBJPYPrice;
            await newPrices.save();
        }
    }
}