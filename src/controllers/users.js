/** @format */

const UserSchema = require("../models/user");

const UserController = {
    create: async (props) => {
        const { address, name, email, password, privateKey } = props;

        var user = await UserSchema.findOne({
            $or: [{ name: name }, { email: email }],
        });

        if (user) throw new Error("Account already exist. Please log In");

        const newUser = new UserSchema({
            address: address,
            name: name,
            email: email,
            password: password,
            address: address,
            privateKey: privateKey,
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
        const { filter } = props;
        return await UserSchema.findOne(filter);
    },
    getUsersInfo: async () => {
        const users = await UserSchema.find();

        return users;
    },
    findUser: async (props) => {
        const { name, password } = props;
        const users = await UserSchema.findOne({
            $or: [{ name: name }, { email: name }],
        }).findOne({ password: password });
        console.log(users);
        if (users) {
            var data = {
                name: users.name,
                email: users.email,
                bio: users.bio,
                address: users.address,
                privateKey: users.privateKey,
                image: users.image,
            };
            return data;
        } else {
            return false;
        }
    },
};

module.exports = { UserController };
