const MongoClient = require('mongodb').MongoClient;

let instance = null;

class User {
  constructor(socket_id, user_id, user) {
    (this as any).socket_id = socket_id;
    (this as any).user_id = user_id;
    (this as any).Name_First = user.Name_First;
    (this as any).Name_Last = user.Name_Last;
    (this as any).Birthdate = user.Birthdate;
  }
}
class myMongo {
  constructor() {
    if(!instance){
      (this as any).activeUsers = {};
      instance = this;
    }
    return instance;
  }
  removeUser(user_id) {
    delete (this as any).activeUsers[user_id];
  }
 async addUser(socket_id, user_id) {
    (this as any).activeUsers[user_id] = socket_id;
    let result = await this.find('users','user_id', user_id);
    //const user = JSON.parse(result);
    console.log(result);
    (this as any).activeUsers[user_id] = new User(socket_id, user_id, result);
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
        (this as any).db = db;
      }
    });
  }
  
  close() {
    (this as any).db.close();
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

  async find(collection, fieldName, value) {
    let result = await (this as any).db.db('myexpressapp').collection(collection).findOne({[fieldName]: value});
    return result;
  }

  async Id2UserName(id) {
    let x = await (this as any).db.db('myexpressapp').collection('users').findOne({user_id: id});
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

module.exports = myMongo
