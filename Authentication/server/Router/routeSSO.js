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
router.get('/api/login-sso', sso.login, function(req, res) {
    const session = req.session[ 'sso_user' ]
    statloggedIn=true;
    console.log(session,statloggedIn,"session"); 
    
    // const token = jwt.sign(session,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '5s' })
    res.cookie('tokenSSO', session, {
        expires: new Date(Date.now() + 21600000),
        httpOnly: true
      });
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
});
router.get('/api/getUser', function(req, res) {
    const session = req.session[ 'sso_user' ]
    console.log("sessiongetUser",statloggedIn,session)
    res.send({ session });
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
module.exports = router