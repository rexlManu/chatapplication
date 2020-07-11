const express = require('express');
const router = express.Router();
const database = require("../database")
const utils = require("../utils/utils");

router.post('/friends', (req, res) => {
    database.User.find({ _id: req.user.friends }, (err, users) => {
        res.json(users);
    });
});

router.post('/sendMessage', (req, res) => {
    var messageText = req.body.message;
    utils.getUserByName(req.body.receiver).then((receiver) => {
        if (!req.user.friends.includes(receiver._id)) {
            return res.json({
                error: {
                    msg: 'Receiver is not your friend'
                }
            });
        }
        if (messageText.length > 255) {
            return res.json({
                error: {
                    msg: 'Message maximum length is 255 chars'
                }
            });
        }

        var data = utils.encryptMessage(messageText, req.user, receiver);

        var message = new database.Message({
            receiver: receiver._id,
            sender: req.user._id,
            data: data
        })

        message.save();
        return res.json({
            message
        });
    }).catch((err) => {
        console.error(err);
        return res.json({
            error: {
                msg: 'Receiver not found'
            }
        });
    });
})

router.post('/chats', (req, res) => {
    utils.getUserByName(req.body.receiver).then(async(receiver) => {
        if (!req.user.friends.includes(receiver._id)) {
            return res.json({
                error: {
                    msg: 'Receiver is not your friend'
                }
            });
        }
        return res.json({
            receivedMessages: utils.decryptMessages(await database.Message.find({ sender: receiver._id, receiver: req.user._id }), receiver, req.user),
            sendMessages: utils.decryptMessages(await database.Message.find({ sender: req.user._id, receiver: receiver._id }), req.user, receiver),
        })
    }).catch((err) => {
        return res.json({
            error: {
                msg: 'Error on fetching receiver data'
            }
        });
    });
})

router.post('/friendRequest', (req, res) => {
    utils.getUserByName(req.body.receiver).then((receiver) => {
        if (!req.user.friends.includes(receiver._id)) {
            return res.json({
                error: {
                    msg: 'Receiver is already your friend'
                }
            });
        }

        if (receiver.friendRequests.includes(req.user._id)) {
            return res.json({
                error: {
                    msg: 'Already sended friendrequest'
                }
            });
        }

        //ACCEPT FRIENDREQUEST
        if (req.user.friendRequests.includes(receiver._id)) {
            remove(req.user.friendRequests, receiver._id);
            req.user.friends.push(receiver._id);
            receiver.friends.push(req.user._id);
            receiver.save();
            req.user.save();
            return res.json({
                success: true,
                friend: receiver
            });
            return;
        }

        receiver.friendRequests.push(req.user._id);
        receiver.save();
        return res.json({
            success: true
        });
    }).catch((err) => {
        console.log(err);
        return res.json({
            error: {
                msg: 'Error on fetching receiver data'
            }
        });
    });
})

function remove(arr, item) {
    for (var i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

module.exports = router;