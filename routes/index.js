const express = require('express');
const passport = require('passport');
const router = express.Router();
const Mongo = require('../mongo.js');

myMongo = new Mongo();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof req.user == "undefined") {
    res.render('index');
  } else {
    doIt(req, res);
  }
});

async function doIt(req, res) {
  const user_name =  await myMongo.Id2UserName(req.user.user_id);
  res.render('index', {user: user_name});
}
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    // Successful login
    // auth0 stored the user id in request.session.passport
    console.log(`SESSION-USER-ID=${req.session.passport.user.id}`);
    myMongo.getUserById(req.user.user_id);
    let options = {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: false, // The cookie only accessible by the web server
      signed: false // Indicates if the cookie should be signed
    }
    // Set cookie
    res.cookie('USER_ID', req.user.user_id, options) // options is optional
    res.redirect(req.session.returnTo || '/');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;
