const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { ethers } = require("ethers");
const NFT = require("../models/nft");
const { UserController } = require("../controllers/users");
const sign = require('jwt-encode');

module.exports = {
    updateInfo: async (req, res) => {
        try {
            const { previousImage, msg, signature, name, bio, email } =
                req.body;

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

                        const account = ethers.utils.verifyMessage(
                            msg,
                            signature
                        );
                        const updateInfo = await UserController.update({
                            address: account,
                            name: name,
                            bio: bio,
                            email: email,
                            image: newImageUrl,
                        });

                        if (updateInfo) {
                            res.json({
                                success: true,
                                msg: "user info updated",
                            });
                        } else {
                            res.json({
                                success: false,
                                msg: "database error",
                            });
                        }
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
    test: async (req, res) => {
        console.log(req.body.msg);

        const result = await NFT.find({
            address: "0x0741592db655f30192e18C732B46E9Ebb9aF641b",
        });
        console.log(result[0].items[2]);
        // res.json({
        //     result: result,
        // });
    },
    Create: async (req, res) => {
        try {
            const { name, email, password } = req.body.account;
            const publicKey = new ethers.Wallet.createRandom();
            const privateKey = publicKey.privateKey;
            console.log(publicKey.address);
            const createUser = await UserController.create({
                name: name,
                email: email,
                password: password,
                publicKey: publicKey.address,
                privateKey: privateKey
            })

            res.json({ status: true });
        } catch (err) {
            res.json({ status: false, error: err.message });
        }
    },
    logIn: async (req, res) => {
        try {
            const { name, password } = req.body.account;
            const userCheck = await UserController.findUser({
                name: name,
                password: password
            });
            if (userCheck) {
                const data = sign(userCheck, process.env.JWT_SECRET);
                res.json({ status: true, data: data });
            } else {
                res.json({ status: false });
            }
        } catch {
            res.json({ status: false });
        }
    }
};
