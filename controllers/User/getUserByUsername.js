const User = require('../../models/User');

//code
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })

        if (user) {
            return res.status(200).json({
                status: true,
                message: "User Found",
                user: user
            })
        }
        else {
            return res.status(200).json({
                status: false,
                message: "User Not Found"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
};