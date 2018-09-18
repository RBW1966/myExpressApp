const MongoClient = require('mongodb').MongoClient;

let instance = null;

class myMongo {

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
  
  addUser(socket_id, user_id) {
    this.activeUsers[user_id] = socket_id;
    // this.db.db('myexpressapp').collection('users').update({user_id: user_id}, {Name_Last: 'XXXXXXX'})
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch( err =>  {
    //     console.log(`ERROR: ${err}`);
    //   });
  }

  connect(mongo_uri) {
    console.log(`MONGODB_URI=${mongo_uri}`); 
    MongoClient.connect(mongo_uri, { useNewUrlParser: true }, (err, db) => {
      if(err) {
        return console.dir(err);
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
  
  find(collection, fieldName, value, callback) {
    this.db.db('myexpressapp').collection(collection).find({[fieldName]: value}).toArray()
      .then(result => {
        callback(result);
      })
      .catch( err =>  {
        console.log(`ERROR: ${err}`);
      });
  }

  logUserInfo(result) {
    console.log(result);
  }

  getUserById(id) {
    console.log(`find users.user_id = ${id}`);
    this.find('users', 'user_id', id, this.logUserInfo)
  }

}

//const robMongo = new myMongo();
module.exports = myMongo
