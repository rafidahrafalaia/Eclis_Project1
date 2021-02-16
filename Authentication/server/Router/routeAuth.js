const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/auth');
const AuthToken = require('../middleware/tokenChecker');
const app = express();

router.post('/register', AuthController.register)

router.post('/loginUser',  AuthController.postLogin,AuthToken.authenticateBlacklist)
router.get('/loginUser',  AuthController.getLogin)
router.get('/testGet',  AuthToken.authenticateBlacklist, AuthToken.authenticateToken,AuthController.getLogin)

router.post('/token', AuthToken.authenticateBlacklist, AuthToken.authenticateToken, AuthController.token)

router.delete('/logout', AuthToken.authenticateBlacklist,AuthToken.authenticateToken, AuthController.delete)

// router.get('/test', AuthToken.authenticateToken,  (req, res) => {
//   res.json(test.filter(test => test.username === req.body.username))
// })
module.exports = router