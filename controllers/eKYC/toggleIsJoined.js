const eKYC = require('../../models/ekyc');

exports.toggleIsJoined = async (req, res) => {
    try {
        console.log('toggleIsJoined:', req.body);
        const updateeKYC = await eKYC.findOne({ _id: req.body.eKYCId });
        if (!updateeKYC) {
            return res.status(404).json({
                status: false,
                message: 'eKYC not found'
            });
        }

        if (req.body.isJoined === false || req.body.isJoined === "false") {
            updateeKYC.isMissed = true;
            updateeKYC.missedTime = new Date();
        }

        if (req.body.isJoined === true || req.body.isJoined === "true") {
            updateeKYC.isMissed = false;
            updateeKYC.missedTime = null;
        }

        updateeKYC.isJoined = req.body.isJoined;
        let doc = await updateeKYC.save();

        console.log(doc);
        return res.status(200).json({
            status: true,
            message: 'eKYC isJoined updated successfully'
        });
    } catch (error) {
        console.error('Error in toggleIsJoined:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}