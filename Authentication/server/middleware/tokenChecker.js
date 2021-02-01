const jwt = require('jsonwebtoken')
const newToken = require('../Controllers/auth')
// const config = require('./config')

const jwt_decode = require('jwt-decode');
module.exports= {
  authenticateToken:async(req, res, next)=>{
    const token = req.cookies['token']
    console.log("authtoken",token)
    // const token = authHeader && authHeader.split('.')[1]
    if(token==null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
          newToken.token
      } 
      // return res.sendStatus(403)
      req.user = user
      // var decoded = jwt_decode(req.cookies['token']);
      // console.log(decoded);
       next()
    })
  },
  authenticateBlacklist:async(req, res, next)=>{
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
    // console.log(token)
    // const token = authHeader && authHeader.split('.')[1]
    if(token==null) return res.sendStatus(401)
    conn.db.query(
      "SELECT * FROM blacklist_jwt WHERE token = ? OR token = ?;",
       [token,refreshToken],
       (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        
        if (result.length > 0) {
          res.sendStatus(403)
      }
      else{
        next()
      }
    }
   );     
  },
  authenticatePermission:async(req, res, next)=>{
    // const token = req.cookies['token']
    // console.log(token)
    // // const token = authHeader && authHeader.split('.')[1]
    // if(token==null) return res.sendStatus(401)
  
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    //   if(err) return res.sendStatus(403)
    //   req.user = user
    //   // var decoded = jwt_decode(req.cookies['token']);
    //   // console.log(decoded);
    //    next()
    // })
  },
}