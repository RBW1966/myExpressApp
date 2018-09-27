var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MongoClient = require('mongodb').MongoClient;
let instance = null;
class User {
    constructor(socket_id, user_id, user) {
        this.socket_id = socket_id;
        this.user_id = user_id;
        this.Name_First = user.Name_First;
        this.Name_Last = user.Name_Last;
        this.Birthdate = user.Birthdate;
    }
}
class myMongo {
    constructor() {
        if (!instance) {
            this.activeUsers = {};
            instance = this;
        }
        return instance;
    }
    removeUser(user_id) {
        delete this.activeUsers[user_id];
    }
    // addUser(socket_id, user_id) {
    //   this.activeUsers[user_id] = socket_id;
    //   this.find('users','user_id', user_id, (result) => {
    //     console.log(result[0]);
    //     this.activeUsers[user_id] = new User(socket_id, user_id, result[0]);
    //   });
    // }
    addUser(socket_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeUsers[user_id] = socket_id;
            let result = yield this.find('users', 'user_id', user_id);
            //const user = JSON.parse(result);
            console.log(result);
            this.activeUsers[user_id] = new User(socket_id, user_id, result);
        });
    }
    connect(mongo_uri) {
        console.log(`MONGODB_URI=${mongo_uri}`);
        MongoClient.connect(mongo_uri, { useNewUrlParser: true }, (err, db) => {
            if (err) {
                console.dir(err);
                console.log("Failed to connect to mongoDB. Application exiting.");
                process.exit();
            }
            else {
                console.log("MongoClient Connected!");
                // Save reference to db
                this.db = db;
            }
        });
    }
    close() {
        this.db.close();
    }
    // find(collection, fieldName, value, callback) {
    //   this.db.db('myexpressapp').collection(collection).find({[fieldName]: value}).toArray()
    //     .then(result => {
    //       callback(result);
    //     })
    //     .catch( err =>  {
    //       console.log(`ERROR: ${err}`);
    //     });
    // }
    find(collection, fieldName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.db.db('myexpressapp').collection(collection).findOne({ [fieldName]: value });
            return result;
        });
    }
    Id2UserName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let x = yield this.db.db('myexpressapp').collection('users').findOne({ user_id: id });
            try {
                const y = `${x.Name_First} ${x.Name_Last}`;
                return y;
            }
            catch (err) {
                console.log(`Id2UserName ERROR: ${err}`);
                return 'USER PROFILE NOT FOUND';
            }
        });
    }
}
module.exports = myMongo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb25nby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFbkQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBRXBCLE1BQU0sSUFBSTtJQUNSLFlBQVksU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2pDLElBQVksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ25DLElBQVksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQy9CLElBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMxQyxJQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzNDLENBQUM7Q0FDRjtBQUNELE1BQU0sT0FBTztJQUVYO1FBQ0UsSUFBRyxDQUFDLFFBQVEsRUFBQztZQUNWLElBQVksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQy9CLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDakI7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQU87UUFDaEIsT0FBUSxJQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsMkNBQTJDO0lBQzNDLHdEQUF3RDtJQUN4RCw4QkFBOEI7SUFDOUIsMkVBQTJFO0lBQzNFLFFBQVE7SUFDUixJQUFJO0lBRUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPOztZQUM1QixJQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUMvQyxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6RCxrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQixJQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsQ0FBQztLQUFBO0lBRUQsT0FBTyxDQUFDLFNBQVM7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUNwRSxJQUFHLEdBQUcsRUFBRTtnQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNoQjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RDLHVCQUF1QjtnQkFDdEIsSUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7YUFDdkI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLO1FBQ0YsSUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsaURBQWlEO0lBQ2pELDJGQUEyRjtJQUMzRix3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLFNBQVM7SUFDVCx3QkFBd0I7SUFDeEIsc0NBQXNDO0lBQ3RDLFVBQVU7SUFDVixJQUFJO0lBRUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSzs7WUFDckMsSUFBSSxNQUFNLEdBQUcsTUFBTyxJQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQzVHLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxFQUFFOztZQUNsQixJQUFJLENBQUMsR0FBRyxNQUFPLElBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUM3RixJQUFJO2dCQUNGLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFNLEdBQUcsRUFBRTtnQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLHdCQUF3QixDQUFDO2FBQ2pDO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1vbmdvQ2xpZW50ID0gcmVxdWlyZSgnbW9uZ29kYicpLk1vbmdvQ2xpZW50O1xyXG5cclxubGV0IGluc3RhbmNlID0gbnVsbDtcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNvY2tldF9pZCwgdXNlcl9pZCwgdXNlcikge1xyXG4gICAgKHRoaXMgYXMgYW55KS5zb2NrZXRfaWQgPSBzb2NrZXRfaWQ7XHJcbiAgICAodGhpcyBhcyBhbnkpLnVzZXJfaWQgPSB1c2VyX2lkO1xyXG4gICAgKHRoaXMgYXMgYW55KS5OYW1lX0ZpcnN0ID0gdXNlci5OYW1lX0ZpcnN0O1xyXG4gICAgKHRoaXMgYXMgYW55KS5OYW1lX0xhc3QgPSB1c2VyLk5hbWVfTGFzdDtcclxuICAgICh0aGlzIGFzIGFueSkuQmlydGhkYXRlID0gdXNlci5CaXJ0aGRhdGU7XHJcbiAgfVxyXG59XHJcbmNsYXNzIG15TW9uZ28ge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYoIWluc3RhbmNlKXtcclxuICAgICAgKHRoaXMgYXMgYW55KS5hY3RpdmVVc2VycyA9IHt9O1xyXG4gICAgICBpbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICByZW1vdmVVc2VyKHVzZXJfaWQpIHtcclxuICAgIGRlbGV0ZSAodGhpcyBhcyBhbnkpLmFjdGl2ZVVzZXJzW3VzZXJfaWRdO1xyXG4gIH1cclxuICBcclxuICAvLyBhZGRVc2VyKHNvY2tldF9pZCwgdXNlcl9pZCkge1xyXG4gIC8vICAgdGhpcy5hY3RpdmVVc2Vyc1t1c2VyX2lkXSA9IHNvY2tldF9pZDtcclxuICAvLyAgIHRoaXMuZmluZCgndXNlcnMnLCd1c2VyX2lkJywgdXNlcl9pZCwgKHJlc3VsdCkgPT4ge1xyXG4gIC8vICAgICBjb25zb2xlLmxvZyhyZXN1bHRbMF0pO1xyXG4gIC8vICAgICB0aGlzLmFjdGl2ZVVzZXJzW3VzZXJfaWRdID0gbmV3IFVzZXIoc29ja2V0X2lkLCB1c2VyX2lkLCByZXN1bHRbMF0pO1xyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG5cclxuIGFzeW5jIGFkZFVzZXIoc29ja2V0X2lkLCB1c2VyX2lkKSB7XHJcbiAgICAodGhpcyBhcyBhbnkpLmFjdGl2ZVVzZXJzW3VzZXJfaWRdID0gc29ja2V0X2lkO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZmluZCgndXNlcnMnLCd1c2VyX2lkJywgdXNlcl9pZCk7XHJcbiAgICAvL2NvbnN0IHVzZXIgPSBKU09OLnBhcnNlKHJlc3VsdCk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgKHRoaXMgYXMgYW55KS5hY3RpdmVVc2Vyc1t1c2VyX2lkXSA9IG5ldyBVc2VyKHNvY2tldF9pZCwgdXNlcl9pZCwgcmVzdWx0KTtcclxuICB9XHJcblxyXG4gIGNvbm5lY3QobW9uZ29fdXJpKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgTU9OR09EQl9VUkk9JHttb25nb191cml9YCk7IFxyXG4gICAgTW9uZ29DbGllbnQuY29ubmVjdChtb25nb191cmksIHsgdXNlTmV3VXJsUGFyc2VyOiB0cnVlIH0sIChlcnIsIGRiKSA9PiB7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZGlyKGVycik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGYWlsZWQgdG8gY29ubmVjdCB0byBtb25nb0RCLiBBcHBsaWNhdGlvbiBleGl0aW5nLlwiKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk1vbmdvQ2xpZW50IENvbm5lY3RlZCFcIik7XHJcbiAgICAgICAgLy8gU2F2ZSByZWZlcmVuY2UgdG8gZGJcclxuICAgICAgICAodGhpcyBhcyBhbnkpLmRiID0gZGI7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBjbG9zZSgpIHtcclxuICAgICh0aGlzIGFzIGFueSkuZGIuY2xvc2UoKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gZmluZChjb2xsZWN0aW9uLCBmaWVsZE5hbWUsIHZhbHVlLCBjYWxsYmFjaykge1xyXG4gIC8vICAgdGhpcy5kYi5kYignbXlleHByZXNzYXBwJykuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5maW5kKHtbZmllbGROYW1lXTogdmFsdWV9KS50b0FycmF5KClcclxuICAvLyAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAvLyAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xyXG4gIC8vICAgICB9KVxyXG4gIC8vICAgICAuY2F0Y2goIGVyciA9PiAge1xyXG4gIC8vICAgICAgIGNvbnNvbGUubG9nKGBFUlJPUjogJHtlcnJ9YCk7XHJcbiAgLy8gICAgIH0pO1xyXG4gIC8vIH1cclxuXHJcbiAgYXN5bmMgZmluZChjb2xsZWN0aW9uLCBmaWVsZE5hbWUsIHZhbHVlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgKHRoaXMgYXMgYW55KS5kYi5kYignbXlleHByZXNzYXBwJykuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5maW5kT25lKHtbZmllbGROYW1lXTogdmFsdWV9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBhc3luYyBJZDJVc2VyTmFtZShpZCkge1xyXG4gICAgbGV0IHggPSBhd2FpdCAodGhpcyBhcyBhbnkpLmRiLmRiKCdteWV4cHJlc3NhcHAnKS5jb2xsZWN0aW9uKCd1c2VycycpLmZpbmRPbmUoe3VzZXJfaWQ6IGlkfSk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB5ID0gYCR7eC5OYW1lX0ZpcnN0fSAke3guTmFtZV9MYXN0fWA7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBJZDJVc2VyTmFtZSBFUlJPUjogJHtlcnJ9YCk7XHJcbiAgICAgIHJldHVybiAnVVNFUiBQUk9GSUxFIE5PVCBGT1VORCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG15TW9uZ29cclxuIl19