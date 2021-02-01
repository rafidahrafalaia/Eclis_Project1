const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mysql = require("mysql");
const { v4: uuidv4 } = require('uuid');
const jwt_decode = require('jwt-decode');
var randtoken = require('rand-token'); 
const conn=require("../database/connection")
let refreshTokens = []
const Users=conn.users;
const BlacklistToken=conn.BlacklistToken;

module.exports = {
    register: async (req, res, next) => {
      try {  
            username = req.body.username;
            email = req.body.email;
            password = req.body.password;
            role = req.body.role;
            jabatan_fungsional = req.body.jabatan_fungsional;
            jabatan_struktual = req.body.jabatan_struktual;
            avatar = req.body.avatar;
            office_number = req.body.office_number;
            personal_number = req.body.personal_number;
            blacklist = req.body.blacklist;
            id=uuidv4();

            let result = await Users.findAndCountAll({
              raw: true,
              where: {
                email: email
              }
            })
            if(result){
              res.status(500).send({
                message:
                  err.message || "email already exist"
              });
            }
            else{
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }
  
                const insertUser = {
                  id:id,
                  email: email,
                  username:username,
                  password: hash,
                  role: role,
                  jabatan_fungsional: jabatan_fungsional,
                  jabatan_struktual: jabatan_struktual,
                  avatar: avatar,
                  office_number: office_number,
                  personal_number: personal_number,
                  blacklist:blacklist
                  };
              
                // Save register in the database
                Users.create(insertUser)
                  .then(data => {
                    res.send(data);
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while creating account"
                    });
                  });         
            });
          }
        }catch (error) {
                if (error.isJoi === true) error.status = 422
                next(error)
              }
            },
getLogin: async (req, res, next) => {
    try {
        if (req.cookies['token']) {
            var decoded = jwt_decode(req.cookies['token']);
            // console.log("testtesestest");
            res.send({ loggedIn: true, session: decoded });
        } else {
            res.send({ loggedIn: false });
        }
    }catch (error) {
        if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
//   });
postLogin: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.userPassword;

    const { count, rows } = await Users.findAndCountAll({
      raw: true,
      where: {
        email: req.body.email
      }
    })
    const result = JSON.parse(JSON.stringify(rows))
    console.log(result)
    // const resPassword= result[0]["password"]
    // conn.db.query(
    //   "SELECT * FROM user WHERE email = ?;",
    //   email,
    //   (err, result) => {
    //     if (err) {
    //       res.send({ err: err });
    //     }
  
        if (count > 0) {
          bcrypt.compare(password, result[0]["password"], (error, response) => {
            if (response) {
            //   req.session.user = result;
              const userData = {
                 "id" : result[0].id,
                 "nama" : result[0].name,
                 "email" : result[0].email,
                 "role" : result[0].role,
                 "permission" : result[0].permission,
                 "jabatan" : result[0].jabatan,
                //  "imgprofile" : result[0].imgprofile,
              }
  
              const token = jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '5s' })
              const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '10s' })
              refreshTokens.push(refreshToken)
              if (token == null) return res.sendStatus(401)
            //   console.log(req.session.user);
              console.log({ message: "LoggedIn" });
           
              res.cookie('token', token, {
                expires: new Date(Date.now() + 21600),
                httpOnly: true
              });
              res.cookie('refreshToken', refreshToken, {
                expires: new Date(Date.now() + 21800),
                httpOnly: true
              });            
            //   console.log(req.cookies['token'])  
              res.json({session:userData,token:token,refreshToken:refreshToken})
            } else {
              res.send({ message: "Wrong email/password combination!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
    //   }
    // );
},
//   });
token: async (req, res, next) => {
    try {
  // let refreshTokens = []
        const refreshToken = req.cookies['refreshToken']
        var decoded = jwt_decode(refreshToken);
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' })
        const newRefreshToken = jwt.sign(decoded, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '10s' })
        res.cookie('token', accessToken, {
          expires: new Date(Date.now() + 21600),
          httpOnly: true
        });
        res.cookie('refreshToken', newRefreshToken, {
          expires: new Date(Date.now() + 21600),
          httpOnly: true
        });
        res.json({ accessToken: accessToken,refreshToken:newRefreshToken })
        })
    }catch(error) {
    next(error)
    }
    },
//   })
delete: async (req, res, next) => {
    try {
//   app.delete('/logout', (req, res) => {
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
    
    const insertBlacklistToken = {
      token: token,
      id:uuidv4()
      };
    const insertBlacklistRefresh = {
      token: refreshToken,
      id:uuidv4()
      };
  
    // Save register in the database
    BlacklistToken.create(insertBlacklistToken)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
    BlacklistToken.create(insertBlacklistRefresh)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  //   conn.db.query(
  //     "INSERT INTO blacklist_jwt (token) VALUES (?),(?)",
  //      [token,refreshToken],
  //      (err, result) => {
  //      console.log(err);
  //  }
  //  );        
   res.clearCookie('token'); 
   res.clearCookie('refreshToken');
    res.sendStatus(204)
  }catch (error) {
    next(error)
  }
},
}