const eKYC = require("../../models/ekyc");

exports.getListOfeKYC = async (req, res) => {
    try {
        let query = {};

        if (req.query.isekycDone) {
            query.isekycDone = req.query.isekycDone;
        }

        if (req.query.isVerified) {
            query.isVerified = req.query.isVerified;
        }

        if (req.query.verificationStatus) {
            query.verificationStatus = req.query.verificationStatus;
        }

        if (req.query.isJoined) {
            query.isJoined = req.query.isJoined;
        }
        if (req.query.isMissed) {
            query.isMissed = req.query.isMissed;
        }


        let eKYCs

        if (Object.keys(query).length > 0) {
            eKYCs = await eKYC.find(query);
        }
        else {
            eKYCs = await eKYC.find();
        }

        if (eKYCs.length > 0) {
            return res.status(200).json({
                status: true,
                noOfeKYCs: eKYCs.length,
                eKYCs: eKYCs
            });
        }
        else {
            return res.status(200).json({
                status: false,
                message: 'No eKYCs found',
            });
        }

    } catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        });
    }
}