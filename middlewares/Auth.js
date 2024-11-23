const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    //console.log(req.headers.authorization)
    if (typeof (req.headers.authorization) == "undefined") {
        res.status(401).json({
            message: "Authorization token required!",
        });
    }

    const token = req.headers.authorization.split(" ")[1];
    //console.log(token)

    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if (err) {

            if (err) {
                if (err.name == "TokenExpiredError") {
                    return res.status(401).json({
                        message: "Authentication Timeout!",
                    });
                } else {
                    return res.status(403).json({
                        message: "Authentication Failed!",
                        err,
                    });
                }
            }

        } else {
            req.token = token;
            next();
        }
    });
};

module.exports = { authenticate };
