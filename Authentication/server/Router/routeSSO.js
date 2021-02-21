const express = require('express');
const router = express.Router();
var SSO = require('sso-ui');
const app = express();
const jwt = require("jsonwebtoken");
const AuthController = require('../Controllers/auth');
var statloggedIn='';
var sso = new SSO({
	url: 'http://localhost:3001', //required
	session_sso: 'sso_user' // defaults to sso_user
});

app.use(sso.middleware)

//sso-ui
router.get('/api/login-sso', sso.login, sso.middleware, function(req, res) {
    const session = req.session[ 'sso_user' ]
    statloggedIn=true;
    console.log(session,statloggedIn,"session"); 
    const token = jwt.sign(session, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE })
    const refresh = jwt.sign(session, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: process.env.REFRESH_TOKEN_LIFE })
    res.cookie('tokenSSO', token, {
      httpOnly: true
    });
    res.cookie('refreshToken', refresh, {
      httpOnly: true
    });
    console.log("sessiongetUser",statloggedIn,session)
    res.redirect('http://localhost:3000/dashboard');
});
router.get('/api/logout-sso',sso.logout, function(req, res){
    // res.status(200).clearCookie('tokenSSO', {
    //   path: '/'
    // });
    // req.session.destroy(function (err) {
    //   res.redirect('/');
    // });
    console.log("logoutSSO")
});
router.get('/api/middleware', sso.middleware);
router.get('/api/user', sso.login, function(req, res) {
    res.json(req.sso_user);
    console.log(req.sso_user,"reqSSO")
    
});
router.get('/api/getUser', function(req, res) {
  const session = req.session[ 'sso_user' ]
  console.log(session)
  return res.json({ session });
});
router.get('/api/logoutsso', sso.clear, function(req, res) {
    res.status(200).clearCookie('tokenSSO', {
      path: '/'
    });
    req.session.destroy(function (err) {
      res.redirect('/');
    });
    console.log("logoutSSO")
    res.redirect('/');
});
router.get('/api/route/to/critical/data', sso.block, function(req, res) {
	res.json({ success: true });
});
// router.use(sso.middleware);
module.exports = router