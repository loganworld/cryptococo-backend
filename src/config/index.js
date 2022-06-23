require("dotenv").config();

module.exports = {
    mongoURI: "mongodb://localhost:27017/db_marketplace",
    secretOrKey: process.env.TOKEN_SECRET || "marketplace",
    port: process.env.PORT,
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    },
};
