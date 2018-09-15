const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const myMongo = require('../mongo.js');

const myDB = myMongo;

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  //const myUser = myDB.getUserById(req.user.user_id);
  res.render('user', {
    pic: 'http://localhost/images/favicon.ico',
    user: req.user ,
    userProfile: JSON.stringify(req.user, null, '  ')
  });

});

module.exports = router;
