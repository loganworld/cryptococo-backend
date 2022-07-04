const NFT = require("../models/nft");
const { UserController } = require("../controllers/users");

const resolvers = {
    Query: {
        getCollectionNFTs: async (parent, args, context, info) => {
            try {
                const allNFTs = await NFT.find();

                return allNFTs;
            } catch (err) {
                console.log(err);
            }
        },
        getCollectionNFT: async (parent, args, context, info) => {
            try {
                const { address } = args;
                const allNFTs = await NFT.find({ address: address });

                return allNFTs;
            } catch (err) {
                console.log(err);
            }
        },
        getAllNFTs: async (parent, args, context, info) => {
            try {
                const allNFTs = await NFT.find();
                let nfts = [];
                allNFTs.map((item) => {
                    for (let i = 0; i < item.items.length; i++) {
                        nfts.push(item.items[i]);
                    }
                });
                return nfts;
            } catch (err) {
                console.log(err);
            }
        },
        getNFTs: async (parent, args, context, info) => {
            try {
                const { address } = args;
                const allNFTs = await NFT.find({ address: address });
                let nfts = [];
                allNFTs.map((item) => {
                    for (let i = 0; i < item.items.length; i++) {
                        nfts.push(item.items[i]);
                    }
                });

                return nfts;
            } catch (err) {
                console.log(err);
            }
        },
        getUserInfo: async (parent, args, context, info) => {
            try {
                const { account } = args;

                if (
                    account !== "" &&
                    account !== undefined &&
                    account !== null
                ) {
                    const checkAccount = await UserController.checkInfo({
                        flag: 1,
                        param: account,
                    });

                    if (!checkAccount) {
                        let result = await UserController.create({
                            address: account,
                        });

                        return result;
                    } else {
                        return checkAccount;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        getUsersInfo: async (parent, args, context, info) => {
            try {
                const allImages = await UserController.getUsersInfo();

                return allImages;
            } catch (err) {
                console.log(err);
            }
        },
    },
};

module.exports = { resolvers };
