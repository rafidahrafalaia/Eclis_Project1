const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const jwt_decode = require('jwt-decode');
var randtoken = require('rand-token'); 
const conn=require("../database/connection")
let refreshTokens = []
const db=conn.sequelize;
const saltRounds = 10;
module.exports = {
    register: async (req, res, next) => {
      try {  
            username = req.body.username;
            email = req.body.email;
            password = req.body.userPassword;
            role = req.body.role;
            jabatan_fungsional = req.body.jabatan_fungsional;
            jabatan_struktual = req.body.jabatan_struktual;
            avatar = req.body.avatar;
            office_number = req.body.office_number;
            personal_number = req.body.personal_number;
            blacklist = req.body.blacklist;
            id=uuidv4();

            let result = await db.users.findAndCountAll({
              raw: true,
              where: {
                email: email
              }
            })
            if(result.cout>0){
              res.status(500).send({
                message: "email already exist"
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
                db.users.create(insertUser)
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
      const tokenSSO = req.cookies['tokenSSO']
      // console.log("authtoken1",token)
      // const token = authHeader && authHeader.split('.')[1]
        if(tokenSSO){
        res.send({ loggedIn: true, sessionSSO: tokenSSO });
        next()
        }
        else if (req.cookies['token']) {
          console.log("tokennnnnn")
            var decoded = jwt_decode(req.cookies['token']);
            console.log(decoded);
            res.send({ loggedIn: true, session: decoded });
        } else if(req.cookies['token']==null&&req.cookies['tokenSSO']==null){
            res.send({ loggedIn: false });
            console.log('false')
        }
    }catch (error) {
        if (error.isJoi === true) error.status = 422
        console.log('err')
            next(error)
        }
    },
//   });
postLogin: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.userPassword;
    db.users.findAll({
      where: {
              email: email
          },
          include: [
              {
                model: db.jabatan,
                 attributes: ['id']
              }, 
             { 
              model: db.role, 
              include: [
                {
                model: db.permission, as: "Permission",
                  // where:{
                  //   id:"e8af6db5-4b65-496a-815c-5f5c1856ec23"
                  // }
                }
              ]
            }
          ]
    }).then(
      users => {
      const resObj = users.map(users => {

        //tidy up the user data
        return Object.assign(
          {},
          {
            userId: users.id,
            username: users.username,
            email: users.email,
            password: users.password,
            jabatan:users.jabatans
            // .map(jabatan => {
            //   return Object.assign(
            //     {},
            //     { 
            //       jabatanId: jabatan.id,}
            //     )  })
            ,
            role: users.roles
            .map(roles => {

            //   //tidy up the roles data
              return Object.assign(
                {},
                {
                  roleId: roles.id,
                  // userId: roles.userId,
                  // name: roles.name,
                  // description: roles.description,
                  permission:roles.Permission
                  .map(Permission => {

            //         //tidy up the permission data
                    return Object.assign(
                      {},
                      {
                        permissionId: Permission.id,
                        // roleId: permissions.roleId,
                        // name: permissions.name,
                        // description: permissions.description
                      }
                    )
                  })
                }
                )
            })
          }
        )
      });
      const result = JSON.parse(JSON.stringify(resObj))
      console.log(result)
    
          if (result) {
            bcrypt.compare(password, result[0]["password"], (error, response) => {
              if (response) {
              //   req.session.user = result;
                const userData = {
                   "id" : result[0].userId,
                   "username" : result[0].username,
                   "email" : result[0].email,
                   "role" : result[0].role,
                  //  "permission" : result[0].permission,
                   "jabatan" : result[0].jabatan,
                  //  "imgprofile" : result[0].imgprofile,
                }
                console.log(userData)
                const token = jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '216000s' })
                const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '218000s' })
                refreshTokens.push(refreshToken)
                if (token == null) return res.sendStatus(401)
              //   console.log(req.session.user);
                console.log({ message: "LoggedIn" });
             
                res.cookie('token', token, {
                  maxAge: 21600 * 1000,
                  httpOnly: true
                });
                res.cookie('refreshToken', refreshToken, {
                  maxAge: 21800 * 1000,
                  httpOnly: true
                });            
              //   console.log(req.cookies['token'])  
                res.send({session:userData,token:token,refreshToken:refreshToken})
              } else {
                res.send({ message: "Wrong email/password combination!" });
              }
            });
          } else {
            res.send({ message: "User doesn't exist" });
          }
    });
    // const { count, rows } = await db.users.findAndCountAll({
    //   raw: true,    
    //   include: [
    //       {
    //         model: db.role,
    //         attributes: ['id'],
    //         include: [
    //           {
    //             model: db.permission, as: "Permission",
    //             attributes: ['id']
    //           }
    //         ]
    //       }
    //     ],
    //   where: {
    //     email: req.body.email
    //   }
    // })
    // const result = JSON.parse(JSON.stringify(resObj))
    //   }
    // );
},
//   });
token: async (req, res, next) => {
    try {
  // let refreshTokens = []
        // res.send({message:"were hwew"})
        console.log("newToken")
        const refreshToken = req.cookies['refreshToken']
        console.log(refreshToken)
        var decoded = jwt_decode(refreshToken);
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        const newRefreshToken = jwt.sign(decoded, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '50' })
        res.cookie('token', accessToken, {
          maxAge: 100 * 1000,
          httpOnly: true
        });
        res.cookie('refreshToken', newRefreshToken, {
          maxAge: 150 * 1000,
          httpOnly: true
        });
        // res.send({ accessToken: accessToken,refreshToken:newRefreshToken })
        })
        next()
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
    console.log(token)
    const insertBlacklistToken = {
      token: token,
      id:uuidv4()
      };
    const insertBlacklistRefresh = {
      token: refreshToken,
      id:uuidv4()
      };
  
    // Save register in the database
    db.BlacklistToken.create(insertBlacklistToken)
    .then({
      // console.log(data);
      // res.cookie("token", "", { expires: new Date() });
    })
    .catch(err => {
      // res.send({
      //   message:
      //     err.message || "Some error occurred while creating the Tutorial."
      // });
    });
    db.BlacklistToken.create(insertBlacklistRefresh)
      .then({
        // console.log(data);
        // res.cookie("refreshToken", "", { expires: new Date() });
      })
      .catch(err => {
        // res.send({
        //   message:
        //     err.message || "Some error occurred while creating the Tutorial."
        // });
      });
      res.clearCookie('token', {
        path: '/'
      });
      res.clearCookie('refreshToken', {
        path: '/'
      });  
       res.clearCookie('tokenSSO', {
        path: '/'
      });
      req.session.destroy(function (err) {
        res.redirect('/');
      });
      // req.session.destroy(function (err) {
      //   res.redirect('/');
      // });
      console.log("tokendel",token)
      console.log("tokende2",refreshToken)
  }catch (error) {
    next(error)
  }
},
}