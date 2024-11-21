const User = require('../../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(200).json({
                status: true,
                isValidUser: false,
                username: req.body.username,
                message: 'User not found'
            })
        }

        let hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');

        if (hash != user.password) {
            return res.status(200).json({
                status: true,
                isValidUser: false,
                username: user.username,
                message: 'Invalid Password'
            })
        }

        const token = jwt.sign({ username: user.username },
            process.env.JWT_KEY, { expiresIn: '1d' })

        return res.status(200).json({
            status: true,
            isValidUser: true,
            token: token,
            username: user.username,
            role: user.role,
            user: {
                title: user.title,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            error: err.toString()
        });
    }
}
