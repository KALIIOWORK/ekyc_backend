const eKYC = require("../../models/ekyc");

exports.createNeweKYC = async (req, res) => {
    try {
        if (!req.files) {
            throw new Error("Please upload Images");
        }

        const newEKYC = new eKYC(req.body);

        const aadharImage = req.files['aadharImage'][0].path;
        const pancardImage = req.files['pancardImage'][0].path;

        newEKYC.aadharImage = `${process.env.API}/public/images/${aadharImage}`;
        newEKYC.pancardImage = `${process.env.API}/public/images/${pancardImage}`;

        let doc = await newEKYC.save();

        if (!doc) {
            throw new Error("Error in creating new eKYC");
        } else {
            return res.status(200).json({
                status: true,
                message: "eKYC document created successfully",
                eKYC: doc
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        });
    }
};