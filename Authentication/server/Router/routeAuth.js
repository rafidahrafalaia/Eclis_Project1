const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/auth');
const AuthToken = require('../middleware/tokenChecker');
const app = express();

router.post('/register', AuthController.register)
router.post('/loginUser',  AuthController.postLogin,AuthToken.authenticateBlacklist)
router.get('/loginUser',AuthToken.authenticateToken, AuthToken.authenticateBlacklist, AuthController.getLogin)
router.get('/testGet',AuthToken.authenticateToken,  AuthToken.authenticateBlacklist,AuthController.getLogin)
router.post('/token', AuthToken.authenticateToken, AuthToken.authenticateBlacklist, AuthController.token)
router.delete('/logout',AuthToken.authenticateToken, AuthToken.authenticateBlacklist, AuthController.delete)

// router.get('/test', AuthToken.authenticateToken,  (req, res) => {
//   res.json(test.filter(test => test.username === req.body.username))
// })
module.exports = router