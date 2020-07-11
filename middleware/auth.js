const jwt = require("jsonwebtoken");
const database = require("../database");
module.exports = async(req, res, next) => {

    if (req.hasOwnProperty("headers") && req.headers.hasOwnProperty("authorization")) {
        try {
            req.user = jwt.verify(req.headers['authorization'], process.env.APP_KEY);
            req.user = (await database.User.find({ _id: req.user._id }))[0];
        } catch (err) {
            return res.status(401).json({
                error: {
                    msg: 'Failed to authenticate token!'
                }
            });
        }
    } else {
        return res.status(401).json({
            error: {
                msg: 'No token!'
            }
        })
    }
    next();
    return;
};