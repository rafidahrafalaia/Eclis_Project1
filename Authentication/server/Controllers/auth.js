const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const jwt_decode = require('jwt-decode');
const conn=require("../database/connection")
let refreshTokens = []
const db=conn.sequelize;
// const emailValidator = require('deep-email-validator');
const saltRounds = 10;
module.exports = {
  register: async (req, res, next) => {
    try {  
      username = req.body.username;
      email = req.body.email;
      password = req.body.userPassword;
      password2 = req.body.userPassword2;
      role = req.body.role;
      jabatan_fungsional = req.body.jabatan_fungsional;
      jabatan_struktual = req.body.jabatan_struktual;
      avatar = req.body.avatar;
      office_number = req.body.office_number;
      personal_number = req.body.personal_number;
      blacklist = req.body.blacklist;
      id=uuidv4();
            // const verify=await emailValidator.validate(email)
            // console.log(verify.valid)
          //  if(!verify.valid) 
          //  return res.status(400).send({
          //    message: "failed to create account, email is wrong/blank"
          //  });
      var n = email.includes("@");
            
      if(!n) return res.status(400).send({
        message: "failed to create account, email is wrong/blank"
      });
            
      if(password!==password2) return res.status(400).send({
        message: "failed to create account, re-confirm password is different"
      });
            
      let result = await db.users.findAndCountAll({
        raw: true,
        where: {
          email: email
        }
      })
            
      if(result.count){
        return res.status(400).send({
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
      // const tokenSSO = req.cookies['tokenSSO']
        if(req.cookies['tokenSSO']){
        return res.send({ loggedIn: true, sessionSSO: req.cookies['tokenSSO'] });
        // next()
        }
        else if (req.cookies['token']) {
          // console.log("tokennnnnn")
            var decoded = jwt_decode(req.cookies['token']);
            console.log(decoded);
            return res.send({ loggedIn: true, session: decoded });
        } else if(req.cookies['token']==null&&req.cookies['tokenSSO']==null){
            return res.send({ loggedIn: false });
            // console.log('false')
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
    let find = await db.users.findAndCountAll({
      raw: true,
      where: {
        email: email
      }
    })
    db.users.findAll({
      where: {
        email: email
      },
      include:[
      {
        model: db.jabatan,
        attributes: ['id']
      }, 
      { 
        model: db.role, as: "Role",
        include: [
        {
          model: db.permission, as: "Permission",
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
            jabatan:users.jabatans,
            role: users.Role
            .map(Role => {
            //   //tidy up the roles data
              return Object.assign(
                {},
                {
                  roleId: Role.id,
                  // userId: roles.userId,
                  // name: roles.name,
                  // description: roles.description,
                  permission:Role.Permission
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
      console.log(find.count)
    
        if (find.count) {
          bcrypt.compare(password, result[0]["password"], (error, response) => {
            if (response) {
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
              const token = jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_LIFE })
              const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: process.env.REFRESH_TOKEN_LIFE })
              if (token == null) return res.sendStatus(401)
              console.log({ message: "LoggedIn" });
             
              res.cookie('token', token, {
                  // maxAge: 21600 * 1000,
                httpOnly: true
              });
              res.cookie('refreshToken', refreshToken, {
                  // maxAge: 21800 * 1000,
                httpOnly: true
              });            
              //   console.log(req.cookies['token'])  
              return res.send({session:userData,token:token,refreshToken:refreshToken})
            } else {
              return res.send({ message: "Wrong email/password combination!" });
            }
          });
        } else {
          return res.send({ message: "User doesn't exist" });
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
        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE })
        const newRefreshToken = jwt.sign(decoded, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: process.env.REFRESH_TOKEN_LIFE })
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
      const token = req.cookies['token']
      const refreshToken = req.cookies['refreshToken']
      console.log(token)
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