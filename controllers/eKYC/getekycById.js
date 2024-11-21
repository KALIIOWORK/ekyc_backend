const eKYC = require("../../models/ekyc");

exports.geteKYCById = async (req, res) => {
    try {
        const eKYCId = req.params.id;
        let eKYCdoc = await eKYC.findOne({ _id: eKYCId });

        if (!eKYCdoc) {
            return res.status(200).json({
                status: false,
                message: "eKYC not found"
            });
        }
        else {
            return res.status(200).json({
                status: true,
                eKYC: eKYCdoc
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        });
    }
}