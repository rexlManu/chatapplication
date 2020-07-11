/*const mysql = require("mysql");

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect();
connection.query("CREATE TABLE IF NOT EXISTS `users` (`uuid` varchar(36) NOT NULL,`nickname` varchar(16) NOT NULL,`password` varchar(255) NOT NULL,`bio` varchar(144) DEFAULT NULL,`name` varchar(32) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1")

module.exports = connection;*/

const mongoose = require('mongoose');
const chalk = require("chalk");
const crypto = require('crypto');
mongoose.connect(`mongodb://${process.env.DB_USER?`${process.env.DB_USER}:${process.env.DB_PASS}@`:''}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`, { useNewUrlParser: true });


var connection = mongoose.connection;

connection.once('open', () => {
    console.log(chalk.green("Connected to mongo database"));
})

var userSchema = new mongoose.Schema({
    nickname: String,
    password: {type: String, toJSON: false, salt: false, private: true, hide: 'dsadsasad'},
    username: String,
    bio: String,
    friends: [String],
    friendRequests: [String]
});

userSchema.methods.isFriend = (friendName) => {

    console.log(this)
    return this.friends.indexOf(friendName) > -1;
};

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    delete obj.friends;
    delete obj.friendRequests;
    return obj;
}

var messageSchema = new mongoose.Schema({
    data: String,
    sender: String,
    receiver: String,
    sendTime: { type: Date, default: Date.now },
    receiveTime: { type: Date, default: null },
    seenTime: { type: Date, default: null }
});

module.exports = mongoose;

module.exports.User = mongoose.model('User', userSchema);

module.exports.Message = mongoose.model('Message', messageSchema);