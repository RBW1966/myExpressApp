var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const sio = require('socket.io');
const iMongo = require('./mongo.js');
const disMongo = new iMongo();
let ioinstance = null;
class myIO {
    constructor(server) {
        if (!ioinstance) {
            this.server = server;
            this.io = new sio(server);
            this.setupHandlers();
            ioinstance = this;
        }
        return ioinstance;
    }
    broadcastChatMessage(msg) {
        this.io.emit('chat', msg);
    }
    setServer(server) {
        this.server = server;
        this.io = new sio(server);
    }
    setupHandlers() {
        // io.set('heartbeat timeout', 4000);
        // io.set('heartbeat interval', 2000);
        this.io.on('connection', socket => {
            console.log(`User ${socket.id} connected`);
            socket.on('disconnect', () => {
                disMongo.removeUser(socket.user_id);
                for (let key in disMongo.activeUsers) {
                    console.log(disMongo.activeUsers[key]);
                }
                console.log(`User ${socket.id} disconnected`);
            });
            socket.on('chat message', (msg) => __awaiter(this, void 0, void 0, function* () {
                let p = msg.indexOf(" ");
                let cmd = "";
                let rest = "";
                if (p > 0) {
                    cmd = msg.substring(0, p);
                    rest = msg.substring(p + 1);
                }
                else {
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
                        }
                        else {
                            this.io.emit('logout');
                        }
                        break;
                    case 'recon':
                        console.log(disMongo.activeUsers);
                        socket.emit('recon');
                        break;
                    default:
                        console.log(`ID=${socket.id} USER=${socket.user_id} MSG=${msg}`);
                        const user_name = yield disMongo.Id2UserName(socket.user_id);
                        const myUser = { "sender": user_name, "msg": msg };
                        this.io.emit('chat', JSON.stringify(myUser));
                }
            }));
            socket.on('register user', function (user_id) {
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
module.exports = myIO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFckMsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUU5QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFFdEIsTUFBTSxJQUFJO0lBRVIsWUFBYSxNQUFNO1FBQ2pCLElBQUcsQ0FBQyxVQUFVLEVBQUM7WUFDWixJQUFZLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUM3QixJQUFZLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELG9CQUFvQixDQUFDLEdBQUc7UUFDckIsSUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBTTtRQUNiLElBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzdCLElBQVksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGFBQWE7UUFDWCxxQ0FBcUM7UUFDckMsc0NBQXNDO1FBRXJDLElBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBRTtZQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsTUFBTSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFM0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZ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Q0FBQztnQkFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO2dCQUMvRCwyQ0FBMkM7Z0JBQzNDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2lvID0gcmVxdWlyZSgnc29ja2V0LmlvJyk7XHJcbmNvbnN0IGlNb25nbyA9IHJlcXVpcmUoJy4vbW9uZ28uanMnKTtcclxuXHJcbmNvbnN0IGRpc01vbmdvID0gbmV3IGlNb25nbygpO1xyXG5cclxubGV0IGlvaW5zdGFuY2UgPSBudWxsO1xyXG5cclxuY2xhc3MgbXlJTyB7XHJcblxyXG4gIGNvbnN0cnVjdG9yIChzZXJ2ZXIpIHtcclxuICAgIGlmKCFpb2luc3RhbmNlKXtcclxuICAgICAgKHRoaXMgYXMgYW55KS5zZXJ2ZXIgPSBzZXJ2ZXI7XHJcbiAgICAgICh0aGlzIGFzIGFueSkuaW8gPSBuZXcgc2lvKHNlcnZlcik7XHJcbiAgICAgIHRoaXMuc2V0dXBIYW5kbGVycygpO1xyXG4gICAgICBpb2luc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBpb2luc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgYnJvYWRjYXN0Q2hhdE1lc3NhZ2UobXNnKSB7XHJcbiAgICAodGhpcyBhcyBhbnkpLmlvLmVtaXQoJ2NoYXQnLCBtc2cpO1xyXG4gIH1cclxuXHJcbiAgc2V0U2VydmVyKHNlcnZlcikge1xyXG4gICAgKHRoaXMgYXMgYW55KS5zZXJ2ZXIgPSBzZXJ2ZXI7XHJcbiAgICAodGhpcyBhcyBhbnkpLmlvID0gbmV3IHNpbyhzZXJ2ZXIpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBIYW5kbGVycygpe1xyXG4gICAgLy8gaW8uc2V0KCdoZWFydGJlYXQgdGltZW91dCcsIDQwMDApO1xyXG4gICAgLy8gaW8uc2V0KCdoZWFydGJlYXQgaW50ZXJ2YWwnLCAyMDAwKTtcclxuXHJcbiAgICAodGhpcyBhcyBhbnkpLmlvLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKGBVc2VyICR7c29ja2V0LmlkfSBjb25uZWN0ZWRgKTtcclxuXHJcbiAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICBkaXNNb25nby5yZW1vdmVVc2VyKHNvY2tldC51c2VyX2lkKTtcclxuICAgICAgICBmb3IgKCBsZXQga2V5IGluIGRpc01vbmdvLmFjdGl2ZVVzZXJzICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZGlzTW9uZ28uYWN0aXZlVXNlcnNba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBVc2VyICR7c29ja2V0LmlkfSBkaXNjb25uZWN0ZWRgKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHNvY2tldC5vbignY2hhdCBtZXNzYWdlJywgYXN5bmMgbXNnID0+IHtcclxuICAgICAgICBsZXQgcCA9IG1zZy5pbmRleE9mKFwiIFwiKTtcclxuICAgICAgICBsZXQgY21kID0gXCJcIjtcclxuICAgICAgICBsZXQgcmVzdCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHAgPiAwKSB7XHJcbiAgICAgICAgICBjbWQgPSBtc2cuc3Vic3RyaW5nKDAsIHApO1xyXG4gICAgICAgICAgcmVzdCA9IG1zZy5zdWJzdHJpbmcocCArIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjbWQgPSBtc2c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGAke2NtZH0gLSAke3Jlc3R9YCk7XHJcbiAgICAgICAgc3dpdGNoIChjbWQpIHtcclxuICAgICAgICAgIGNhc2UgJ3Rlcm0nOlxyXG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpLmlvLmVtaXQoJ3Rlcm1pbmF0ZScpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdlbmQnOlxyXG4gICAgICAgICAgICBpZiAocmVzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGhlU29ja2V0SUQgPSBkaXNNb25nby5hY3RpdmVVc2Vyc1tyZXN0XS5zb2NrZXRfaWQ7XHJcbiAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5pby50byh0aGVTb2NrZXRJRCkuZW1pdCgnbG9nb3V0Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5pby5lbWl0KCdsb2dvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ3JlY29uJzpcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGlzTW9uZ28uYWN0aXZlVXNlcnMpO1xyXG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgncmVjb24nKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgSUQ9JHtzb2NrZXQuaWR9IFVTRVI9JHtzb2NrZXQudXNlcl9pZH0gTVNHPSR7bXNnfWApO1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyX25hbWUgPSAgYXdhaXQgZGlzTW9uZ28uSWQyVXNlck5hbWUoc29ja2V0LnVzZXJfaWQpO1xyXG4gICAgICAgICAgICBjb25zdCBteVVzZXIgPSB7XCJzZW5kZXJcIjogdXNlcl9uYW1lLCBcIm1zZ1wiOiBtc2d9O1xyXG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpLmlvLmVtaXQoJ2NoYXQnLCBKU09OLnN0cmluZ2lmeShteVVzZXIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBzb2NrZXQub24oJ3JlZ2lzdGVyIHVzZXInLCBmdW5jdGlvbih1c2VyX2lkKSB7XHJcbiAgICAgICAgc29ja2V0LnVzZXJfaWQgPSB1c2VyX2lkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFJFR0lTVEVSIFVTRVI6IHNvY2tldC5pZD0ke3NvY2tldC5pZH0gdXNlcl9pZD0ke3VzZXJfaWR9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAvL215TW9uZ28uYWN0aXZlVXNlcnNbc29ja2V0LmlkXSA9IHVzZXJfaWQ7XHJcbiAgICAgICAgZGlzTW9uZ28uYWRkVXNlcihzb2NrZXQuaWQsIHVzZXJfaWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBBY3RpdmUgVXNlcnM6ICR7ZGlzTW9uZ28uYWN0aXZlVXNlcnN9YCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG15SU8iXX0=