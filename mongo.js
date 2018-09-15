const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

class myMongo {

  connect() {
    dotenv.load();
    console.log(process.env.MONGODB_URI);
    
    MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, db) => {
      if(err) {
        return console.dir(err);
      } else {
        console.log("Connected!");
      }
    });
  }
  
  close() {
    db.close();
  }
  
  find(collection, fieldName, value) {
    db.db('myexpressapp').collection(collection).find({fieldName: value}).toArray()
      .then(result => {
        console.log(result);
      })
      .catch( err =>  {
        console.log(`ERROR: ${err}`);
      });
    return result;
  }

  getUserById(id) {
    myUser = find('users', 'user_id', id);
    console.log(myUser);
  }
}

module.exports = myMongo
