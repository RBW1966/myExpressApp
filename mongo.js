// const express = require('express');
// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// const Auth0Strategy = require('passport-auth0');
// const flash = require('connect-flash');
// Retrieve
const MongoClient = require('mongodb').MongoClient;
 const dotenv = require('dotenv');

class myMongo {

  connect() {
    dotenv.load();
    console.log(process.env.MONGODB_URI);
    
    MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, db) => {
    //MongoClient.connect("mongodb://myExpressUser:abc123@ds245347.mlab.com:45347/myexpressapp"), { useNewUrlParser: true }, (err, db) => {
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
    return null;
  }
}

module.exports = myMongo;

// // Connect to the db
// MongoClient.connect("mongodb://myExpressUser:abc123@ds245347.mlab.com:45347/myexpressapp", { useNewUrlParser: true }, (err, db) => {

//   if(err) {
//     return console.dir(err);
//   } else {
//     console.log("Connected!");
//   }
//   db.db('myexpressapp').collection('users').find({"user_id": "XXX"}).toArray()
//   .then(result => {
//     console.log(result);
//   });
//   db.close();

// });

// module.exports = MongoClient;