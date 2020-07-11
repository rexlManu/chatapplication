const express = require("express");
const router = express.Router();
const database = require("../database");
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.json({
            error: {
                msg: 'Username or password is missing in body'
            }
        });
    }

    var user = database.User.find({ username }, (err, users) => {
        if (users.length == 0) {
            return res.json({
                error: {
                    msg: 'Username not found in db'
                }
            });
        }
        var user = users[0];

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return res.json({
                    error: {
                        msg: 'Password is incorrect'
                    }
                });
            }
            jwt.sign(user.toObject(), process.env.APP_KEY, function(err, token) {
                if (err) {
                    return res.json({
                        error: {
                            msg: 'Error occuried while signing token'
                        }
                    });
                }
                return res.json({
                    success: true,
                    token
                })
            }, { expiresIn: '30d' });
        });
    });
})

router.post('/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.json({
            error: {
                msg: 'Username or password is missing in body'
            }
        });
    }

    if (password.length < 8) {
        return res.json({
            error: {
                msg: 'The password minimal length is 8'
            }
        });
    }
    if (username.length > 16) {
        return res.json({
            error: {
                msg: 'The username maximal length is 16'
            }
        });
    }

    var user = database.User.find({ username }, (err, user) => {
        if (user.length != 0) {
            return res.json({
                error: {
                    msg: 'Username is already in use'
                }
            });
        }

        bcrypt.hash(password, saltRounds, function(err, hash) {
            var newUser = new database.User({ nickname: username, username, password: hash, bio: "" })
            newUser.save();
            jwt.sign(newUser.toObject(), process.env.APP_KEY, function(err, token) {
                if (err) {
                    return res.json({
                        error: {
                            msg: 'Error occuried while signing token'
                        }
                    });
                }
                return res.json({
                    success: true,
                    token
                })
            }, { expiresIn: '30d' });
        });
    });
})

module.exports = router;