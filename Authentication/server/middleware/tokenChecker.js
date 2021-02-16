const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");
const newToken = require('../Controllers/auth')
// const config = require('./config')
const conn=require("../database/connection")
const db=conn.sequelize;
const jwt_decode = require('jwt-decode');
const e = require('express');
module.exports= {
  authenticateToken:async(req, res, next)=>{
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
    const tokenSSO = req.cookies['tokenSSO']
    console.log("authtoken1",token)
    // const token = authHeader && authHeader.split('.')[1]
    if(tokenSSO){
      // res.send({ loggedIn: true, sessionSSO: tokenSSO });
      next()
    }
    else if(token==null&&refreshToken==null&&tokenSSO==null) return res.send({ message: "Hasn't LoggedIn Yet!!" })
    // else if(token) {
    //   // res.send({message:"newToken"})
    // newToken.token
    // }
    console.log(token,"cek")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      // console.log("lwt")
      if(err){
        console.log("err")
        newToken.token
        const refreshToken = req.cookies['refreshToken']
        var decoded = jwt_decode(refreshToken);
        if (refreshToken == null) return res.sendStatus(401)
        // if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET)
        const newRefreshToken = jwt.sign(decoded,process.env.REFRESH_TOKEN_SECRET)
        res.cookie('token', accessToken, {
          maxAge: 21600 * 1000,
          httpOnly: true
        });
        res.cookie('refreshToken', newRefreshToken, {
          maxAge: 21800 * 1000,
          httpOnly: true
        });
        // res.json({ accessToken: accessToken,refreshToken:newRefreshToken })
        })
        // next()
      } 
      // return res.sendStatus(403)
      else{
      req.user = user
      console.log("next")
      // var decoded = jwt_decode(req.cookies['token']);
      // console.log(decoded);
      //  next()
      }
      next()
    })
  },
  authenticateBlacklist:async(req, res, next)=>{
    const tokenSSO = req.cookies['tokenSSO']
    const token = req.cookies['token']
    const refreshToken = req.cookies['refreshToken']
    // console.log(token)
    // const token = authHeader && authHeader.split('.')[1]
    if(tokenSSO)
    next()
    else if(token==null) next()
    let result = await db.BlacklistToken.findAndCountAll({
      raw: true,
      where: {
        [Op.or]: [
          { token: token },
          { token: refreshToken}
        ]
      }
    })
    // conn.db.query(
    //   "SELECT * FROM blacklist_jwt WHERE token = ? OR token = ?;",
    //    [token,refreshToken],
    //    (err, result) => {
    //     if (err) {
    //       res.send({ err: err });
    //     }
        
        if(result.count > 0) {
          console.log("blacklisted")
          return res.send({ message: "Token is blocked!!" })
      }
      else{
        // res.send({ message: "fine" })
        next()
      }
    // }
  //  );     
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
          // where:{
          //   id:"e8af6db5-4b65-496a-815c-5f5c1856ec23"
          // }
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
            email: users.email,
            password: users.password,
            jabatan:users.jabatans,
            role: users.roles
            .map(roles => {

            //   //tidy up the roles data
              return Object.assign(
                {},
                {
                  roleId: roles.id,
                  userId: roles.userId,
                  name: roles.name,
                  system:roles.system_environment,
                  description: roles.description, 
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
      let permission=false;
      var i = resObj[0].role.length;
      while (i--) {
        console.log(i)
      if(resObj[0].role[i].system.includes('HUKUM')||resObj[0].role[i].system.includes('ADMIN')){
      var j = resObj[0].role[i].permission.length;
        while(j--){
          console.log(j)
          if (resObj[0].role[i].permission[j].permissionId.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25')) {
            res.json(resObj)
            permission=true;
            next()
          }
        }
      }
    }
      // console.log(resObj[0].role.length)
      // console.log(resObj[0].role[0].permission.length)
      // console.log(resObj[0].role.permission.permissionId.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25'))
      // if(resObj.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25')){
      // }
      // else{
      if(permission===false)
        res.send({message:"wrong roles/permission"})
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
            // where:{
            //   id:"e8af6db5-4b65-496a-815c-5f5c1856ec23"
            // }
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
              email: users.email,
              password: users.password,
              jabatan:users.jabatans,
              role: users.roles
              .map(roles => {
  
              //   //tidy up the roles data
                return Object.assign(
                  {},
                  {
                    roleId: roles.id,
                    userId: roles.userId,
                    name: roles.name,
                    system:roles.system_environment,
                    description: roles.description, 
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
        // console.log(resObj[0].role.length)
        // console.log(resObj[0].role[0].permission.length)
        // console.log(resObj[0].role.permission.permissionId.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25'))
        // if(resObj.includes('63c0b55c-dcf8-4882-86e2-6e50017f4e25')){
        // }
        // else{
        if(permission===false)
          return res.send({message:"wrong roles/permission"})
          
        // }
      });
    }
  catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
}