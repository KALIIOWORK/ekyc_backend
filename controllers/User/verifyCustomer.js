const eKYC = require("../../models/ekyc");
const User = require("../../models/User");

exports.verifyCustomer = async (req, res) => {
    try {

        const verifier = await User.findOne({ username: req.body.username })

        if (!verifier) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateeKYC = await eKYC.findOne({ _id: req.body.eKYCId });

        if (!updateeKYC) {
            return res.status(404).json({ message: "eKYC not found" });
        }

        updateeKYC.isVerified = true;
        updateeKYC.verificationStatus = req.body.verificationStatus;
        updateeKYC.verificationComments = req.body.verificationComments;

        let updatedeKYC = await updateeKYC.save();

        if (!updatedeKYC) {
            return res.status(500).json({
                message: "Error in updating eKYC",
            });
        }
        return res.status(200).json({
            message: "eKYC updated successfully",
            ekyc: updatedeKYC
        });


    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        });
    }
}


