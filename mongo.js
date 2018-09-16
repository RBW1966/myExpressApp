const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

class myMongo {

  connect() {
    console.log(`MONGODB_URI=${process.env.MONGODB_URI}`);
    
    MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, db) => {
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

const robMongo = new myMongo();
module.exports = robMongo
