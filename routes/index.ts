const eexpress = require('express');
const epassport = require('passport');
const router = eexpress.Router();
const eMongo = require('../mongo.js');
const myeMongo = new eMongo();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/index.html');
});

/* GET chat page. */
router.get('/chat', function(req, res, next) {
  if (typeof req.user == "undefined") {
    res.render('failure');
  } else {
    doIt(req, res, 'chat');
  }
});

/* GET storage page. */
router.get('/storage', function(req, res, next) {
  if (typeof req.user == "undefined") {
    res.render('failure');
  } else {
    doIt(req, res, 'storage');
  }
});

/* GET secured page. */
router.get('/secured', function(req, res, next) {
  if (typeof req.user == "undefined") {
    res.render('failure');
  } else {
    doIt(req, res, 'secured');
  }
});

/* GET records page. */
router.get('/records', function(req, res, next) {
  if (typeof req.user == "undefined") {
    res.render('failure');
  } else {
    doIt(req, res, 'records');
  }
});

async function doIt(req, res, dest) {
  const user_name =  await myeMongo.Id2UserName(req.user.user_id);
  res.render(dest, {user: user_name});
}
router.get('/login', epassport.authenticate('auth0', {
  scope: 'openid email profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  epassport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    // Successful login
    // auth0 stored the user id in request.session.passport
    console.log(`SESSION-USER-ID=${req.session.passport.user.id}`);
   // myMongo.getUserById(req.user.user_id);
    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
      httpOnly: false, // The cookie only accessible by the web server
      signed: false // Indicates if the cookie should be signed
    }
    // Set cookie
    res.cookie('USER_ID', req.session.passport.user.id, options) // options is optional
    res.redirect(req.session.returnTo || '/secured');
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
