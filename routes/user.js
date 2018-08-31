const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', {
    pic: 'http://localhost/images/favicon.ico',
    user: req.user ,
    userProfile: JSON.stringify(req.user, null, '  ')
  });
  let email = req.user.displayName;
  // console.log(`Hi ${req.user.user_id}`);
  console.log(`Hi ${req.user.displayName}`);
});

module.exports = router;
