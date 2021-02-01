const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/auth');
const AuthToken = require('../middleware/tokenChecker');
const app = express();

// const test = [
//     {
//       username: 'Kyle',
//       title: 'Post 1'
//     },
//     {
//       username: 'Jim',
//       title: 'Post 2'
//     }
//   ]

router.post('/register', AuthController.register)

router.post('/loginUser',  AuthController.postLogin)
router.get('/loginUser', AuthToken.authenticateToken, AuthController.getLogin)

router.post('/token', AuthToken.authenticateBlacklist, AuthToken.authenticateToken, AuthController.token)

router.delete('/logout',  AuthController.delete)

// router.get('/test', AuthToken.authenticateToken,  (req, res) => {
//   res.json(test.filter(test => test.username === req.body.username))
// })
module.exports = router