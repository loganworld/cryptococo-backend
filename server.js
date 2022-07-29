const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const config = require("./src/config");
const routes = require("./src/api/routes");
const { typeDefs } = require("./src/config/graphql");
const { resolvers } = require("./src/graphql");
const blockchainHandle = require("./src/blockchainApis");

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
    })
);

// Connect to MongoDB
mongoose
    .connect(config.mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Use Routes
routes(router);
app.use("/api", router);

//blockchain Handle
blockchainHandle();

app.use(express.static(__dirname + "/../crypto-coco-frontend/build"));
app.get("/*", function (req, res) {
    res.sendFile(__dirname + "/index.html", function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

const startApolloServer = async (typeDefs, resolvers) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: "bounded",
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    const PORT = config.port || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startApolloServer(typeDefs, resolvers);
