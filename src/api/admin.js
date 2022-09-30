const jwt = require("jsonwebtoken");
const { AdminController, AdminNFTController } = require("../controllers");

module.exports = {
    Check: async (req, res) => {
        try {
            let check = await AdminController.getAll();

            if (check.length > 0) {
                res.status(200).json({ result: true });
            } else {
                res.status(200).json({ result: false });
            }
        } catch (err) {
            console.log(err.message);
        }
    },
    Create: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            let check = await AdminController.findOne({
                filter: {
                    email: email,
                },
            });

            if (check) {
                res.status(303).end();
                return;
            }

            let admins = await AdminController.getAll();

            const result = await AdminController.create({
                name: name,
                email: email,
                password: password,
                allow: admins.length === 0 ? true : false,
            });

            if (result) res.status(200).end();
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    },
    Login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const admin = await AdminController.findOne({
                filter: {
                    email: email,
                },
            });
            if (!admin || admin.password !== password) {
                res.status(404).end();
                return;
            }
            if (!admin.allow) {
                res.status(403).end();
                return;
            }
            const data = jwt.sign(admin._doc, process.env.JWT_SECRET, {
                expiresIn: "144h",
            });
            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    },
    Update: async (req, res) => {
        const {} = req.body;
    },
    RemoveNFT: async (req, res) => {
        try {
            const { collectionAddress, nftAddress } = req.body;

            const result = await AdminNFTController.removeNFT({
                collection: collectionAddress,
                id: nftAddress,
            });

            if (result) {
                res.status(200).json({
                    success: true,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    },
    RemoveUser: async (req, res) => {
        try {
            const { address } = req.body;

            const result = await AdminNFTController.removeUser({
                address: address,
            });

            if (result) {
                res.status(200).json({
                    success: true,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    },
    adminMiddleware: (req, res, next) => {
        try {
            const token = req.headers.authorization || "";
            jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
                console.log("Error: ", err);
                if (err) return res.sendStatus(403);
                const admin = await AdminController.findOne({
                    filter: {
                        name: userData.name,
                    },
                });
                req.admin = admin;
                next();
            });
        } catch (err) {
            if (err) return res.sendStatus(403);
        }
    },
    GetAllAdmin: async (req, res) => {
        try {
            const result = await AdminController.getAll();

            if (result) {
                res.status(200).json({
                    data: result,
                });
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).end();
        }
    },
    UpdateAllow: async (req, res) => {
        try {
            const { email, checked } = req.body;
            const result = await AdminController.updateAllow({
                email: email,
                checked: checked,
            });

            if (result) {
                const alldata = await AdminController.getAll();

                res.status(200).json({
                    data: alldata,
                });
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).end();
        }
    },
    RemoveAdmin: async (req, res) => {
        try {
            const { email } = req.body;

            const result = await AdminController.removeAdmin({
                email: email,
            });

            if (result) {
                res.status(200).json({
                    success: true,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    },
};
