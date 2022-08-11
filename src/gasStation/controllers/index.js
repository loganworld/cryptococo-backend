const colors = require("colors");
const { ExchangeRequests, ETHPrices, AdminSettings } = require("./models");

const EXRequestController = {
    // create new request
    createRequest: async (props) => {
        const { userAddress, amount, price, currency, sessionId } = props;
        const newRequest = new ExchangeRequests({
            userAddress,
            amount,
            price,
            currency,
            sessionId,
        });
        await newRequest.save();
    },

    // update request status: onProcessing, success, failed, rejected
    updateRequest: async (props) => {
        const { filter, status } = props;
        const request = await ExchangeRequests.updateOne(filter, {
            $set: {
                status: status,
            },
        });
        return request;
    },
    removeRequest: async (props) => {
        const { filter } = props;
        await ExchangeRequests.deleteOne(filter);
    },
    findRequests: async (props) => {
        const { filter } = props;
        const requests = await ExchangeRequests.find(filter);
        return requests;
    },
    findRequest: async (props) => {
        const { filter } = props;
        const request = await ExchangeRequests.findOne(filter);
        return request;
    },
};

const PriceController = {
    updatePrices: async (props) => {
        const { ETHEURPrice, ETHUSDPrice, ETHJPYPrice } = props;
        const prices = await ETHPrices.findOne();
        if (!prices) {
            const newPrices = new ETHPrices({
                ETHEURPrice, ETHUSDPrice, ETHJPYPrice
            });
            await newPrices.save();
        }
        else {
            prices.ETHEURPrice = ETHEURPrice;
            prices.ETHUSDPrice = ETHUSDPrice;
            prices.ETHJPYPrice = ETHJPYPrice;
            await prices.save();
        }
    },
    getPrices: async (props) => {
        const prices = await ETHPrices.findOne();
        return prices
    }
}

const AdminController = {
    updateSetting: async (props) => {
        const { newSetting } = props;
        const adminSettings = await AdminSettings.updateOne({}, { $set: newSetting });
        return adminSettings;
    },
    createSetting: async (props) => {
        var adminSettings = await AdminSettings.findOne();
        if (adminSettings) return;
        adminSettings = new AdminSettings({ ExchangeFee: 5 });
        await adminSettings.save();
    },
    getSetting: async (props) => {
        return await AdminSettings.findOne();
    }
}

module.exports = {
    EXRequestController,
    PriceController,
    AdminController
}