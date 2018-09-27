const sio = require('socket.io');
const iMongo = require('./mongo.js');

const disMongo = new iMongo();

let ioinstance = null;

class myIO {

  constructor (server) {
    if(!ioinstance){
      (this as any).server = server;
      (this as any).io = new sio(server);
      this.setupHandlers();
      ioinstance = this;
    }
    return ioinstance;
  }

  broadcastChatMessage(msg) {
    (this as any).io.emit('chat', msg);
  }

  setServer(server) {
    (this as any).server = server;
    (this as any).io = new sio(server);
  }

  setupHandlers(){
    // io.set('heartbeat timeout', 4000);
    // io.set('heartbeat interval', 2000);

    (this as any).io.on('connection', socket => {

      console.log(`User ${socket.id} connected`);

      socket.on('disconnect', () => {
        disMongo.removeUser(socket.user_id);
        for ( let key in disMongo.activeUsers ) {
          console.log(disMongo.activeUsers[key]);
        }
        console.log(`User ${socket.id} disconnected`);
      });
      socket.on('chat message', async msg => {
        let p = msg.indexOf(" ");
        let cmd = "";
        let rest = "";
        if (p > 0) {
          cmd = msg.substring(0, p);
          rest = msg.substring(p + 1);
        } else {
          cmd = msg;
        }
        console.log(`${cmd} - ${rest}`);
        switch (cmd) {
          case 'term':
            (this as any).io.emit('terminate');
            process.exit();
            break;
          case 'end':
            if (rest.length > 0) {
              const theSocketID = disMongo.activeUsers[rest].socket_id;
              (this as any).io.to(theSocketID).emit('logout');
            } else {
              (this as any).io.emit('logout');
            }
            break;
          case 'recon':
            console.log(disMongo.activeUsers);
            socket.emit('recon');
            break;
          default:
            console.log(`ID=${socket.id} USER=${socket.user_id} MSG=${msg}`);
            const user_name =  await disMongo.Id2UserName(socket.user_id);
            const myUser = {"sender": user_name, "msg": msg};
            (this as any).io.emit('chat', JSON.stringify(myUser));
        }
      });
      socket.on('register user', function(user_id) {
        socket.user_id = user_id;
        console.log("-----------------------------------------------");
        console.log(`REGISTER USER: socket.id=${socket.id} user_id=${user_id}`);
        console.log("-----------------------------------------------");
        //myMongo.activeUsers[socket.id] = user_id;
        disMongo.addUser(socket.id, user_id);
        console.log(`Active Users: ${disMongo.activeUsers}`);
      });
    });
  }
}

module.exports = myIO