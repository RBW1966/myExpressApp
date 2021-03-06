//const sio = require('socket.io');
//const iMongo = require('./mongo.js');
//const disMongo = new iMongo();
//import * as socketio from "socket.io";
import iMongo from "./mongo";
const disMongo = new iMongo();

let ioinstance = null;

class myIO {
  server: string;
  io: any;
  constructor (server) {
    if(!ioinstance){
      this.server = server;
      this.io = require("socket.io")(server);
      this.setupHandlers();
      ioinstance = this;
    }
    return ioinstance;
  }

  broadcastChatMessage(msg) {
    const myMessage = {"sender": "System", "msg": msg};
    this.io.emit('chat', JSON.stringify(myMessage));
  }
  setupHandlers(): void {
    // io.set('heartbeat timeout', 4000);
    // io.set('heartbeat interval', 2000);
    setInterval(() => {
      const d = new Date();
      this.broadcastChatMessage(d.toLocaleString());
    }, 10000);

    this.io.on('connection', socket => {

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
            this.io.emit('terminate');
            process.exit();
            break;
          case 'end':
            if (rest.length > 0) {
              const theSocketID = disMongo.activeUsers[rest].socket_id;
              this.io.to(theSocketID).emit('logout');
            } else {
              this.io.emit('logout');
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
            this.io.emit('chat', JSON.stringify(myUser));
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

export = myIO;