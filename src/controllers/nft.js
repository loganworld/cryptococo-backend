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
    findNFT: async (props) => {
        const { collectionAddress, id } = props;

        const item = await NFT.findOne({
            $and: [
                { address: collectionAddress },
                { items: { $elemMatch: { tokenID: id } } },
            ],
        });

        return item;
    },
    findCollection: async (props) => {
        const { collectionAddress } = props;

        const item = await NFT.findOne({
            address: collectionAddress,
        });

        return item;
    },
    createCollection: async (props) => {
        const {
            logoImage,
            bannerImage,
            collectionAddress,
            name,
            extUrl,
            desc,
            fee,
            fee_recipent,
        } = props;

        const newCollection = new NFT({
            address: collectionAddress,
            metadata: {
                name: name,
                description: desc,
                coverImage: bannerImage,
                image: logoImage,
                external_url: extUrl,
                fee: fee,
                fee_recipent: fee_recipent,
            },
        });

        let collection = await newCollection.save();

        return collection;
    },
};

module.exports = { nftControl };
