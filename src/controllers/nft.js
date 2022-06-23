const NFT = require("../models/nft");

const nftControl = {
    update: async (props) => {
        const { id, collection, currentAddress } = props;

        let key = "items." + id + ".likes";
        const itemCheck = await NFT.findOne({
            $and: [
                {
                    address: collection,
                },
                {
                    [key]: currentAddress,
                },
            ],
        });

        var result = null;
        if (itemCheck === null) {
            result = await NFT.updateOne(
                { address: collection },
                {
                    $push: {
                        [key]: currentAddress,
                    },
                }
            );
        } else {
            result = await NFT.updateOne(
                { address: collection },
                {
                    $pull: {
                        [key]: currentAddress,
                    },
                }
            );
        }

        return result;
    },
};

module.exports = { nftControl };
