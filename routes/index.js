const express = require('express');
const passport = require('passport');
const router = express.Router();
const myMongo = require('../mongo.js');

const myDB = myMongo;

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
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    process.env.user_id = req.user.user_id;
    res.cookie('user_id', process.env.user_id, { maxAge: 900000, httpOnly: true });
    myDB.getUserById(req.user.user_id);
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
