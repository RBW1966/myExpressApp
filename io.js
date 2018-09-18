const io = require('socket.io')
const server = require('/server.js');

class myIO {

  constructor (server) {
    this.server = server;
    this.io = new io(server);
  }

}

const robIO = new myIO(server);
module.exports = robIO