//const MongoClient = require('mongodb').MongoClient;
import { MongoClient as MongoClient } from "mongodb";

let instance = null;

class User {
  socket_id: string;
  user_id: string;
  name_first: string;
  name_last: string;
  birthdate: Date;

  constructor(socket_id, user_id, user) {
    this.socket_id = socket_id;
    this.user_id = user_id;
    this.name_first = user.Name_First;
    this.name_last = user.Name_Last;
    this.birthdate = user.Birthdate;
  }
}
class myMongo {
  activeUsers: object;
  db: any;
  constructor() {
    if(!instance){
      this.activeUsers = {};
      instance = this;
    }
    return instance;
  }
  removeUser(user_id) {
    delete this.activeUsers[user_id];
  }
 async addUser(socket_id, user_id) {
    this.activeUsers[user_id] = socket_id;
    let result = await this.find('users','user_id', user_id);
    //const user = JSON.parse(result);
    console.log(result);
    this.activeUsers[user_id] = new User(socket_id, user_id, result);
  }

  connect(mongo_uri) {
    console.log(`MONGODB_URI=${mongo_uri}`); 
    MongoClient.connect(mongo_uri, { useNewUrlParser: true }, (err, db) => {
      if(err) {
        console.dir(err);
        console.log("Failed to connect to mongoDB. Application exiting.");
        process.exit();
      } else {
        console.log("MongoClient Connected!");
        // Save reference to db
        this.db = db;
      }
    });
  }
  
  close() {
    this.db.close();
  }
  async find(collection, fieldName, value) {
    let result = await this.db.db('myexpressapp').collection(collection).findOne({[fieldName]: value});
    return result;
  }
  async Id2UserName(id) {
    let x = await this.db.db('myexpressapp').collection('users').findOne({user_id: id});
    try {
      const y = `${x.Name_First} ${x.Name_Last}`;
      return y;
    }
    catch(err) {
      console.log(`Id2UserName ERROR: ${err}`);
      return 'USER PROFILE NOT FOUND';
    }
  }
}

//module.exports = myMongo
export = myMongo;