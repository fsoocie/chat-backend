const socket = require('socket.io');

module.exports = (http) => {
    const io = socket(http);
    io.on('connection', (socket) => {
        socket.on('send', (e) => {
            console.log(e)
        })
    });
    return io
};