const Axios = require("axios");
const { PriceController, EXRequestController } = require("../controllers")
const cron = require("node-cron");

// blockchain
const { TreasuryContract } = require("../contracts");
const { toBigNum } = require("../../utils");

const PriceUpdator = async () => {
    const updator = async () => {
        try {
            const priceEndPoint = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy%2Cusd%2Ceur"
            const prices = await Axios.get(priceEndPoint);
            if (!prices?.ethereum) return;
            await PriceController.updatePrices({
                ETHEURPrice: prices.ethereum.eur,
                ETHUSDPrice: prices.ethereum.usd,
                ETHJPYPrice: prices.ethereum.jpy
            });
        } catch (err) {
            console.log("gasStation/PriceUpdator :", err.message);
        }
    }
    cron.schedule(`*/15 * * * * *`, () => {
        console.log(`running a price updator every 15 second`);
        updator();
    });
}

// processing request
const RequestUpdator = async () => {
    const updator = async () => {
        try {
            // get pending requests
            let requests = await EXRequestController.findRequests({ status: "pending" });
            requests.splice(15);

            if (requests.length > 0) {                // make transaction
                let tos = [], amounts = [];
                await Promise.all(requests.map(async (request) => {
                    tos.push[request.userAddress]
                    amounts.push(toBigNum([request.amount]));
                    await EXRequestController.updateRequest(request._id, "onprocessing");
                }));

                try {
                    var tx = await TreasuryContract.multiSend(tos, amounts);
                    await tx.wait();

                    // update status
                    await Promise.all(requests.map(async (request) => {
                        await EXRequestController.updateRequest(request._id, "success");
                    }));
                } catch (err) {
                    // revoce status
                    await Promise.all(requests.map(async (request) => {
                        await EXRequestController.updateRequest(request._id, "pending");
                    }));
                }
            }
        } catch (err) {
            console.log("gasStation/RequestUpdator :", err.message);
        }
    }

    cron.schedule(`*/15 * * * * *`, () => {
        console.log(`running a request updator every 15 second`);
        updator();
    });
}

module.exports = { PriceUpdator, RequestUpdator };