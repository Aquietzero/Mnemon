var search = require('./search');

var Socket = function (io) {
    this.io = io;
}

Socket.prototype.setup = function () {
    this.io.on('connection', function (socket) {
        socket.on('search:word', function (word) {
            search(word, function (err, result) {
                socket.emit('searched:word', {
                    err: err,
                    data: result,
                });
            });
        });
    });
}

module.exports = Socket;
