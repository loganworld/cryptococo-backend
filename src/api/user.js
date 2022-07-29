const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { ethers } = require("ethers");
const NFT = require("../models/nft");
const { UserController } = require("../controllers");
// const jwtEncode = require('jwt-encode');
const jwt = require("jsonwebtoken");

module.exports = {
    updateInfo: async (req, res) => {
        try {
            const { previousImage, name, bio, email } = req.body;

            if (
                previousImage !== null &&
                previousImage !== "" &&
                previousImage !== undefined
            ) {
                let deleteImage =
                    "marketplace/" +
                    previousImage.slice(
                        previousImage.lastIndexOf("/") + 1,
                        previousImage.length - 4
                    );

                cloudinary.uploader.destroy(deleteImage, function (result) {
                    console.log("del error: ", result);
                });
            }

            if (req.files !== null && req.files !== undefined) {
                const cld_upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "marketplace",
                    },
                    async (error, result) => {
                        if (error) {
                            throw new Error("upload failed");
                        }
                        let newImageUrl = result.url;

                        await UserController.update({
                            address: req.user.address,
                            name: name,
                            bio: bio,
                            email: email,
                            image: newImageUrl,
                        });
                        const user = await UserController.checkInfo({
                            param: req.user.address,
                            flag: 1,
                        });

                        var data = {
                            name: user.name,
                            email: user.email,
                            bio: user.bio,
                            address: user.address,
                            privateKey: user.privateKey,
                        };
                        const token = jwt.sign(data, process.env.JWT_SECRET, {
                            expiresIn: "144h",
                        });
                        res.json({ status: true, data: token });
                    }
                );

                streamifier
                    .createReadStream(req.files.newimage.data)
                    .pipe(cld_upload_stream);
            }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                msg: "server error",
            });
        }
    },
    Create: async (req, res) => {
        try {
            const { name, email, password } = req.body.account;
            const wallet = new ethers.Wallet.createRandom();
            const privateKey = wallet.privateKey;
            console.log(wallet.address);
            await UserController.create({
                name: name,
                email: email,
                password: password,
                address: wallet.address,
                privateKey: privateKey,
            });

            res.json({ status: true });
        } catch (err) {
            res.json({ status: false, error: err.message });
        }
    },
    logIn: async (req, res) => {
        try {
            const { name, password } = req.body.account;
            const user = await UserController.findUser({
                name: name,
                password: password,
            });
            if (!user) throw new Error("Invalid Auth");
            const data = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: "144h",
            });
            res.json({ status: true, data: data });
        } catch (err) {
            console.log(err.message);
            res.json({ status: false });
        }
    },

    middleware: (req, res, next) => {
        try {
            const token = req.headers.authorization || "";
            jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
                console.log("Error: ", err);
                if (err) return res.sendStatus(403);
                const user = await UserController.checkInfo({
                    param: userData.name,
                    flag: 3,
                });
                req.user = user;
                next();
            });
        } catch (err) {
            if (err) return res.sendStatus(403);
        }
    },
};
