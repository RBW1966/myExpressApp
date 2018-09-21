const sio = require('socket.io');
const Mongo = require('./mongo.js');

const myMongo = new Mongo();

let instance = null;

class myIO {

  constructor (server) {
    if(!instance){
      this.server = server;
      this.io = new sio(server);
      this.setupHandlers();
      instance = this;
    }
    return instance;
  }

  broadcastChatMessage(msg) {
    this.io.emit('chat', msg);
  }

  setServer(server) {
    this.server = server;
    this.io = new sio(server);
  }

  setupHandlers(){
    // io.set('heartbeat timeout', 4000);
    // io.set('heartbeat interval', 2000);

    this.io.on('connection', socket => {

      console.log(`User ${socket.id} connected`);

      socket.on('disconnect', () => {
        myMongo.removeUser(socket.user_id);
        for ( let key in myMongo.activeUsers ) {
          console.log(myMongo.activeUsers[key]);
        }
        console.log(`User ${socket.id} disconnected`);
      });
      socket.on('chat message', async msg => {
        switch (msg) {
          case 'term':
            this.io.emit('terminate');
            process.exit();
            break;
          case 'end':
            this.io.emit('logout');
            break;
          case 'recon':
            socket.emit('recon');
            break;
          default:
            console.log(`ID=${socket.id} USER=${socket.user_id} MSG=${msg}`);
            const user_name =  await myMongo.Id2UserName(socket.user_id);
            const myUser = {"sender": user_name, "msg": msg}
            this.io.emit('chat', JSON.stringify(myUser));
        }
      });
      socket.on('register user', function(user_id) {
        socket.user_id = user_id;
        console.log("-----------------------------------------------");
        console.log(`REGISTER USER: socket.id=${socket.id} user_id=${user_id}`);
        console.log("-----------------------------------------------");
        //myMongo.activeUsers[socket.id] = user_id;
        myMongo.addUser(socket.id, user_id);
        console.log(`Active Users: ${myMongo.activeUsers}`);
      });
    });
  }

}

module.exports = myIO