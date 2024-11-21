const User = require('../../models/User');
const crypto = require('crypto');

exports.createNewUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        console.log(req.body)

        if (user) {
            throw new Error("User username already exists")
        }
        else {
            const newUser = new User(req.body);

            let fullName = req.body.firstName
            if (req.body.middleName) fullName = fullName + " " + req.body.middleName;
            fullName = fullName + " " + req.body.lastName

            newUser.fullName = fullName;

            let salt = crypto.randomBytes(16).toString('hex');
            let hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');


            newUser.password = hash
            newUser.salt = salt

            let doc = await newUser.save();

            if (!doc) {
                throw new Error("Unable to add User")
            }
            else {
                return res.status(200).json({
                    status: true,
                    message: "New User Added Successfully",
                    User: doc
                })
            }
        }
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
};