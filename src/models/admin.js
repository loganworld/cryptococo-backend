const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AdminSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    allow: {
        type: Boolean,
    },
});

module.exports = ADMIN = mongoose.model("admins", AdminSchema);
