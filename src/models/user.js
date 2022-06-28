/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserBasicSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    publicKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
    image: {
        type: String,
    },
});

const UserItem = new Schema({
    coverimage: {
        type: String,
        default: "",
    },
    backgroundimage: {
        type: String,
        default: "",
    },
    follow: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: "",
    },
});

const UserSchema = new Schema();
UserSchema.add(UserBasicSchema).add(UserItem);

module.exports = User = mongoose.model("users", UserSchema);
