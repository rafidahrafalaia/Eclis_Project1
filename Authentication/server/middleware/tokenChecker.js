const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");
// const newToken = require('../Controllers/auth')
const conn=require("../database/connection")
const db=conn.sequelize;
const { v4: uuidv4 } = require('uuid');
const jwt_decode = require('jwt-decode');
const e = require('express');
module.exports= {
  authenticateToken:async(req, res, next)=>{
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
    const tokenSSO = req.cookies['tokenSSO']
    var dateNow = new Date();

    if(tokenSSO){
      try{
      var decodedRefresh = jwt_decode(refreshToken)
    }catch (error) {
      res.clearCookie('refreshToken', {
        path: '/'
      });  
       res.clearCookie('tokenSSO', {
        path: '/'
      });
      return res.send({ loggedIn: false });
      // if (error.isJoi === true) 
        // error.status = 422
        // next(error)
        }
    
        try{
          var decodedSSO = jwt_decode(tokenSSO) 
        }catch (error) {
          res.clearCookie('refreshToken', {
            path: '/'
          });  
           res.clearCookie('tokenSSO', {
            path: '/'
          });
          return res.send({ loggedIn: false });
        // if (error.isJoi === true) 
          // error.status = 422
          // next(error)
          }
    
      console.log(decodedRefresh,"decode")
      if(decodedSSO.exp < dateNow.getTime()/1000)
      {
        const insertBlacklistToken = {
          token: tokenSSO,
          id:uuidv4()
          };
        db.BlacklistToken.create(insertBlacklistToken)
        .then({
          // console.log(data);
          // res.cookie("token", "", { expires: new Date() });
        })
        .catch(err => {
          return res.send({
            message:
              err.message || "Some error occurred while creating the Blacklist."
          });
        });  
      }

      if(decodedRefresh.exp < dateNow.getTime()/1000)
      {
          const insertBlacklistRefresh = {
            token: refreshToken,
            id:uuidv4()
            };
          db.BlacklistToken.create(insertBlacklistRefresh)
          .then({
            // console.log(data);
            // res.cookie("refreshToken", "", { expires: new Date() });
          })
          .catch(err => {
            return res.send({
              message:
                err.message || "Some error occurred while creating the Blacklist."
            });
          });
        }
      jwt.verify(tokenSSO, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
        console.log("err")
        const refreshToken = req.cookies['refreshToken']
        console.log(decodedRefresh)
        const userData = {
           "username" : decodedRefresh.username
        }
        if (refreshToken == null) return res.sendStatus(401)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.send({ loggedIn: false });
        }
        
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_LIFE })
        const newRefreshToken = jwt.sign(userData,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: process.env.REFRESH_TOKEN_LIFE })
        res.cookie('tokenSSO', accessToken, {
          httpOnly: true
        });
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true
        });
        })
      } 
      else{
      req.user = user
      console.log("next")
      }
      // next()
    })
    }
 
    else if(token){
      try{
      var decodedRefresh = jwt_decode(refreshToken)
        }catch (error) {
          res.clearCookie('refreshToken', {
            path: '/'
          });  
           res.clearCookie('token', {
            path: '/'
          });
          return res.send({ loggedIn: false });
        // if (error.isJoi === true) 
          // error.status = 422
          // next(error)
          }
    
      // var decodedRefresh = jwt_decode(refreshToken);
      try{
      var decoded = jwt_decode(token);
    }catch (error) {
      res.clearCookie('refreshToken', {
        path: '/'
      });  
       res.clearCookie('token', {
        path: '/'
      });
    }
      if(decoded.exp < dateNow.getTime()/1000)
      {
        console.log("expiredToken")
        const insertBlacklistToken = {
          token: token,
          id:uuidv4()
          };
        db.BlacklistToken.create(insertBlacklistToken)
        .then({
          // console.log(data);
          // res.cookie("token", "", { expires: new Date() });
        })
        .catch(err => {
          return res.send({
            message:
              err.message || "Some error occurred while creating the Blacklist."
          });
        });  
      }

      if(decodedRefresh.exp < dateNow.getTime()/1000)
      {
          const insertBlacklistRefresh = {
            token: refreshToken,
            id:uuidv4()
            };
          db.BlacklistToken.create(insertBlacklistRefresh)
          .then({
            // console.log(data);
            // res.cookie("refreshToken", "", { expires: new Date() });
          })
          .catch(err => {
            return res.send({
              message:
                err.message || "Some error occurred while creating the Blacklist."
            });
          });
        }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
          console.log("err")
          // const refreshToken = req.cookies['refreshToken']
          // var decoded = jwt_decode(refreshToken);
          console.log(decoded)
          const userData = {
            "id" : decodedRefresh.id,
            "username" : decodedRefresh.username,
            "email" : decodedRefresh.email,
            "role" : decodedRefresh.role,
            "jabatan" : decodedRefresh.jabatan,
          }
          const insertBlacklistToken = {
            token: token,
            id:uuidv4()
            };
          db.BlacklistToken.create(insertBlacklistToken)
          .then({
            // console.log(data);
            // res.cookie("token", "", { expires: new Date() });
          })
          .catch(err => {
            return res.send({
              message:
                err.message || "Some error occurred while creating the Tutorial."
            });
          });
          if (refreshToken == null) return res.sendStatus(401)
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) {   
            
            return res.send({ loggedIn: false });
            // const insertBlacklistRefresh = {
            //   token: refreshToken,
            //   id:uuidv4()
            //   };
            // db.BlacklistToken.create(insertBlacklistRefresh)
            // .then({
            //   // console.log(data);
            //   // res.cookie("refreshToken", "", { expires: new Date() });
            // })
            // .catch(err => {
            //   return res.send({
            //     message:
            //       err.message || "Some error occurred while creating the Tutorial."
            //   });
            // });
            // return res.sendStatus(403)
          }
          
          const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_LIFE })
          const newRefreshToken = jwt.sign(userData,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: process.env.REFRESH_TOKEN_LIFE })
          res.cookie('token', accessToken, {
            httpOnly: true
          });
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true
          });
          })
          // next()
        } 
        // return res.sendStatus(403)
        else{
        req.user = user
        console.log("next")  
        }
        // next()
      })
  }   

    else if(token==null&&refreshToken==null&&tokenSSO==null) return res.send({ message: "Hasn't LoggedIn Yet!!" })

    next()
  },
  authenticateBlacklist:async(req, res, next)=>{
    const tokenSSO = req.cookies['tokenSSO']
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
  
    if(tokenSSO) {
      let result = await db.BlacklistToken.findAndCountAll({
        raw: true,
        where: {
          [Op.or]: [
            { token: tokenSSO },
            { token: refreshToken}
          ]
        }
      })     
      if(result.count) {
        console.log("blacklisted")
        return res.send({ message: "Token is blocked!!" })
      }
      else next()
    }
    else if(token){
      let result = await db.BlacklistToken.findAndCountAll({
        raw: true,
        where: {
          [Op.or]: [
            { token: token },
            { token: refreshToken}
          ]
        }
      })     
      if(result.count) {
        console.log("blacklisted")
        return res.send({ message: "Token is blocked!!" })
      }
      else next()
    }
    else next()
    // next()
  },
  authenticatePermission1:async(req, res, next)=>{ 
    try { 
    const token = req.cookies['token']
    var decoded = jwt_decode(token);  
    db.users.findAll({
      where: {
              id: decoded.id
          },
      include: [
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
        return Object.assign(
          {},
          {
            userId: users.id,
            email: users.email,
            password: users.password,
            jabatan:users.jabatan,
            role: users.Role
            .map(Role => {
              return Object.assign(
                {},
                {
                  roleId: Role.id,
                  userId: Role.userId,
                  name: Role.name,
                  system:Role.system_environment,
                  description: Role.description, 
                  permission:Role.Permission
                  .map(Permission => {
                    return Object.assign(
                      {},
                      {
                        permissionId: Permission.id
                      }
                    )
                  })
                }
                )
            })
          }
        )
      });   
      let permission=false;
      var i = resObj[0].role.length;
      while (i--) {
        console.log(i)
      // if(resObj[0].role[i].system.includes('HUKUM')||resObj[0].role[i].system.includes('ADMIN')){
      var j = resObj[0].role[i].permission.length;
        while(j--){
          console.log(j)
          if (resObj[0].role[i].permission[j].permissionId.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25')) {
            // res.json(resObj)
            permission=true;
            next()
          }
        }
      }
    // }
      if(permission===false)
        return res.send({message:"user unauthorized!!"})
      // }
    });
  }
catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
    authenticatePermission2:async(req, res, next)=>{ 
      try { 
      const token = req.cookies['token']
      var decoded = jwt_decode(token);  
      db.users.findAll({
        where: {
                id: decoded.id
            },
        include: [
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
         return Object.assign(
            {},
            {
              userId: users.id,
              email: users.email,
              password: users.password,
              jabatan:users.jabatan,
              role: users.Role
              .map(Role => {
                return Object.assign(
                  {},
                  {
                    roleId: Role.id,
                    userId: Role.userId,
                    name: Role.name,
                    system:Role.system_environment,
                    description: Role.description, 
                    permission:Role.Permission
                    .map(Permission => {
                      return Object.assign(
                        {},
                        {
                          permissionId: Permission.id,
                        }
                      )
                    })
                  }
                  )
              })
            }
          )
        });   
        let permission=false;
        var i = resObj[0].role.length;
        while (i--) {
          console.log(resObj[0].role)
        if(resObj[0].role[i].system.includes('ADMIN')){
        var j = resObj[0].role[i].permission.length;
          while(j--){
            console.log(j)
            if (resObj[0].role[i].permission[j].permissionId.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25')) {
              // res.json(resObj)
              permission=true;
              next()
            }
          }
        }
      }
       if(permission===false)
          return res.send({message:"user unauthorized!!"})
      });
    }
  catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
}