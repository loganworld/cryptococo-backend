const Stripe = require("stripe");
const { RequestUpdator, PriceUpdator } = require("./updators");
const {
    PriceController,
    EXRequestController,
    AdminController,
} = require("../controllers");

// turn on updator
RequestUpdator();
PriceUpdator();
AdminController.createSetting();

module.exports = {
    /**
     * api/newRequest(req,res) : make new request
     * req params
     * @param {Number} buyAmount - eth amount
     * @param {String} currency - JPY,USD,EUR
     * @param {String} successUrl - redirect url when payment success
     * @param {String} cancelUrl - redirect url when payment cancel
     * return session
     */
    newRequest: async (req, res) => {
        try {
            const {
                buyAmount,
                currency = "JPY",
                successUrl = "http://31.220.21.14",
                cancelUrl = "http://31.220.21.14",
            } = req.body;

            if (buyAmount > 1) {
                res.status(400).send({ error });
                return;
            }

            // get currency price
            const prices = await PriceController.getPrices();
            var price, currencyType;
            switch (currency) {
                case "USD":
                    price = prices.ETHUSDPrice;
                    currencyType = "usd";
                    break;
                case "EUR":
                    price = prices.ETHEURPrice;
                    currencyType = "eur";
                    break;
                default:
                    price = prices.ETHJPYPrice;
                    currencyType = "jpy";
            }

            // request data
            const userAddress = req.user.address;
            const amount = Number(buyAmount).toFixed(8);
            const fiatAmount = Number(
                Number(buyAmount * price * 100).toFixed(0)
            );

            // stripe session
            const stripe = Stripe(process.env.STRIPEPRIVATEKEY);

            const session = await stripe.checkout.sessions.create({
                client_reference_id: userAddress,
                customer_email: req.user.email ? req.user.email : "",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            // The currency parameter determines which
                            // payment methods are used in the Checkout Session.
                            currency: currencyType,
                            product_data: {
                                name: "Ethereum",
                            },
                            unit_amount: fiatAmount,
                        },
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    description: `Buy Ether`,
                },
                mode: "payment",
                success_url: successUrl,
                cancel_url: cancelUrl,
            });

            //save request data
            await EXRequestController.createRequest({
                userAddress: req.user.address,
                amount: amount,
                price: price,
                currency: currencyType,
                sessionId: session.id,
            });

            res.status(200).send(session);
        } catch (error) {
            console.log("gasStation/newRequest", error.message);
            res.status(500).send({ error });
        }
    },
    /**
     * api/complete payment(req,res) : complete payment webhook from stripe
     * req params
     * @param {Object} rawBody
     * @param {String} tripe-signature
     * return status
     */
    completePayment: async (req, res, buf) => {
        let event;
        try {
            console.log(req.headers["stripe-signature"]);
            event = Stripe.webhooks.constructEvent(
                req.rawBody,
                req.headers["stripe-signature"],
                "whsec_2c209b234e2d28e5b80d2e8e1aaba02d1b66f9c67bd347dc61a66cf6e5025bf6"
            );
            console.log(req.headers["stripe-signature"]);
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            try {
                await EXRequestController.updateRequest({
                    filter: { sessionId: session.id },
                    status: { status: "pending" },
                });
            } catch (error) {
                return res.status(404).send({ error, session });
            }
        }

        return res.status(200).send({ received: true });
    },
    /**
     * set admin fee
     * @param  {Number} newFee
     */
    setAdminFee: async (req, res) => {
        const { newFee } = req.body;
        if (newFee && Number(newFee) > 0 && Number(newFee) < 100) {
            await AdminController.updateSetting({ ExchangeFee: newFee });
        }
    },
    /**
     * get Exchange fee
     * @return param  {Number} ExFee
     */
    getFee: async (req, res) => {
        const ExFee = await AdminController.getSetting().ExchangeFee;
        res.status(200).send(ExFee);
    },
    /**
     * get all requests for user
     * @return param  {[{userAddress,amount,price,currency,status,sessionId}]} requests
     */
    getRequests: async (req, res) => {
        const userAddress = req.user.address;
        console.log(userAddress);
        if (!userAddress)
            return res.status(500).send({ error: "invalid auth" });
        const requests = await EXRequestController.findRequests({
            filter: {
                userAddress: userAddress,
            },
        });
        console.log(requests);
        res.status(200).send(requests);
    },
};
