const express = require('express');
const router = express.Router();
var SSO = require('sso-ui');
const app = express();

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
    res.send({ session });
});

router.get('/api/logout-sso', sso.logout, function(req, res){
    const session = req.session[ 'sso_user' ]
    statloggedIn=false;
    console.log(session,statloggedIn,"session");
    res.send({ session })
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
    const session = req.session[ 'sso_user' ]
    console.log(session,loggedIn,"session&loggedIn");
    res.send({ session })
    res.redirect('/');
});
router.get('/api/route/to/critical/data', sso.block, function(req, res) {
	res.json({ success: true });
});
module.exports = router