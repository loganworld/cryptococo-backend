/** @format */
const ADMIN = require("../models/admin");
const NFTs = require("../models/nft");
const Users = require("../models/user");

const AdminController = {
    create: async (props) => {
        const { name, email, password, allow } = props;

        const newAdmin = new ADMIN({
            name: name,
            email: email,
            password: password,
            allow: allow,
        });
        let adminData = await newAdmin.save();

        return adminData;
    },
    findOne: async (props) => {
        const { filter } = props;

        const result = await ADMIN.findOne(filter);

        return result;
    },
    getAll: async () => {
        const result = await ADMIN.find();

        return result;
    },
    updateAllow: async (props) => {
        const { email, checked } = props;
        const result = await ADMIN.updateOne(
            {
                email: email,
            },
            {
                allow: checked,
            }
        );

        return result;
    },
    removeAdmin: async (props) => {
        const { email } = props;

        const result = await ADMIN.deleteOne({
            email: email,
        });

        return result;
    },
};

const AdminNFTController = {
    removeNFT: async (props) => {
        const { collection, id } = props;

        const result = await NFTs.updateOne(
            {
                address: collection,
            },
            {
                $pull: {
                    items: { tokenID: id },
                },
            }
        );

        return result;
    },
    removeUser: async (props) => {
        const { address } = props;

        const result = await Users.deleteOne({
            address: address,
        });

        return result;
    },
};

module.exports = { AdminController, AdminNFTController };
