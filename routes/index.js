const express = require('express');
const passport = require('passport');
const router = express.Router();
const Mongo = require('../mongo.js');
const dotenv = require('dotenv');

myMongo = new Mongo();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  //res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=http%3A%2F%2Flocalhost&client_id=${process.env.AUTH0_CLIENT_ID}`);
  res.redirect('http://localhost');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    console.log(`SESSION-USER-ID=${req.session.passport.user.id}`);
    myMongo.getUserById(req.user.user_id);
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
