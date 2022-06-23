/** @format */

const UserSchema = require("../models/user");

const UserController = {
    create: async (props) => {
        const { address } = props;

        const newUser = new UserSchema({
            address: address,
            name: "unnamed",
            bio: "",
            email: "",
            image: "",
        });

        let userData = await newUser.save();

        return userData;
    },
    update: async (props) => {
        const { address, name, bio, email, image } = props;

        const result = await UserSchema.updateOne(
            {
                address: address,
            },
            {
                $set: {
                    image: image,
                    name: name,
                    bio: bio,
                    email: email,
                },
            }
        );

        return result;
    },
    checkInfo: async (props) => {
        const { param, flag } = props;

        let result;
        switch (flag) {
            case 1: // address check
                result = await UserSchema.findOne({ address: param });
                break;
            case 2: // email check
                result = await UserSchema.findOne({ email: param });
                break;
            case 3: // name check
                result = await UserSchema.findOne({ name: param });
                break;
            default:
                break;
        }

        return result;
    },
    getUsersInfo: async () => {
        const users = await UserSchema.find();

        return users;
    },
};

module.exports = { UserController };
