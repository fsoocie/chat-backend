const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const createServer = require('http').createServer;

require('./core/db');
const createSocket = require('./core/createSocket');
const createRoutes = require('./core/routes');
const checkAuth = require('./middlewares/checkAuth');
const updateAt = require('./middlewares/updateAt')
require('dotenv').config();

const app = express();
const http = createServer(app);
const io = createSocket(http);

app.use(bodyParser.json());
app.use(checkAuth);
app.use(updateAt);

createRoutes(app, io);

http.listen(process.env.PORT, () => {
    console.log('Server has been started oN "' + process.env.PORT + '" port');
});