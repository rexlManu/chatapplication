require("dotenv").config();

const chalk = require("chalk");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const Promise = require("bluebird");

io.on("connection", (socket) => {
    console.log(chalk.blue("New user connection"));
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/api', require('./middleware/auth'))
app.use('/api', require('./api/api'));

app.use('/auth', require('./api/auth'));

app.get('/', (req, res) => res.sendFile(__dirname + '/sites/chat.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/sites/register.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/sites/login.html'));


app.use(express.static("public"));

http.listen(process.env.HTTP_PORT, () => {
    console.log(chalk.green(`Http Server listening on port ${process.env.HTTP_PORT}.`));
});