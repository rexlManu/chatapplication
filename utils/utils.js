const database = require('../database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = {

    getUserByName: (name) => new Promise((resolve, reject) => {
        database.User.find({ username: name }).then((users) => {
            if (users.length == 0) {
                return reject();
            }
            resolve(users[0]);
        }).catch((err) => {
            reject(err);
        })
    }),

    encryptMessage: (text, user, receiver) => {
        return jwt.sign(text, `${process.env.APP_KEY} - ${user.username} - ${receiver.username}`);
    },

    decryptMessage: (data, user, receiver) => {
        return jwt.verify(data, `${process.env.APP_KEY} - ${user.username} - ${receiver.username}`);
    },

    decryptMessages: (messages, sender, receiver) => {
        var msg = [];
        messages.forEach(message => {
            var obj = message.toObject();
            delete obj.__v;
            delete obj.sender;
            delete obj.receiver;
            delete obj._id;
            delete obj.data;
            obj.text = utils.decryptMessage(message.data, sender, receiver);
            msg.push(obj)
        })
        return msg;
    }

}

module.exports = utils;