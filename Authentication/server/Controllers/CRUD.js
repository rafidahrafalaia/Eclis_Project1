const bcrypt = require("bcrypt");
const conn=require("../database/connection")
const db=conn.sequelize;
const jwt_decode = require('jwt-decode');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
// const sequelize = new Sequelize('mariadb');
const Sequelize = require("sequelize");

module.exports = {
  //CRUD User
  ReadUsersROlePermission: async (req, res, next) => {
    try { 
        const users = await db.users.findAll( 
        {  
          attributes:[
            'username', 'email',
            [Sequelize.fn('count', Sequelize.col('Role.id')) ,'RoleCount'],
            [Sequelize.fn('count', Sequelize.col('jabatan.id')) ,'JabatanCount']
        ],
          include: [
            {
              model: db.role, as: "Role",
              attributes: ['id'],
              include: [
                {
                  model: db.permission, as: "Permission",
                  attributes: ['id'],
                }
              ]
            }
          ]
        }
        );
      
        page_number=req.body.page;
        page_size=2;
        // console.log(users.count)
        if(users){
         return res.json(users.slice((page_number - 1) * page_size, page_number * page_size))
     }
      // console.log(users.every(user => user instanceof db.users));
      // res.json(users)
      //   users => {
      //   const resObj = users.map(users => {
  
      //     //tidy up the user data
      //     return Object.assign(
      //       {},
      //       {
      //         userId: users.id,
      //         email: users.email,
      //         password: users.password,
      //         role: users.role.map(post => {
  
      //           //tidy up the post data
      //           return Object.assign(
      //             {},
      //             {
      //               roleId: role.id,
      //               userId: role.userId,
      //               name: role.name,
      //               description: role.description.map(permission => {
  
      //                 //tidy up the comment data
      //                 return Object.assign(
      //                   {},
      //                   {
      //                     permissionId: permission.id,
      //                     roleId: permission.roleId,
      //                     name: permission.name,
      //                     description: permission.description
      //                   }
      //                 )
      //               })
      //             }
      //             )
      //         })
      //       }
      //     )
      //   });
      //   res.json(resObj)
      // });
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  ReadUsers: async (req, res, next) => {
        try { 
          id = req.body.id;
              
          let result = await db.users.findAll({
            // raw: true,
            attributes:[
              'username', 'email',
              [Sequelize.fn('count', Sequelize.col('Role.id')) ,'RoleCount'],
              [Sequelize.fn('count', Sequelize.col('jabatan.id')) ,'JabatanCount']
             
          ],
          include: [
            {
              model: db.role, as: "Role",
              attributes: []
            },
            {
              model: db.jabatan,
              attributes: ['name'],
            },
          ],
            group: ['users.id']
            // where: {
            //   id: id
            // }
          })
          page_number=req.body.page;
          page_size=2;
           const obj=result.slice((page_number - 1) * page_size, page_number * page_size);
         
          if(result.length){
           return res.json({totalData:result.length,totalHalaman:Math.ceil(result.length/page_size),obj})
          }
          else return res.send({message:"data users is empty!"})
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  SearchUsers: async (req, res, next) => {
   try { 
      id = req.body.id;
                
    db.users.findAll({
      where: {
              id: id
          },
      include: [
        {
        model: db.jabatan,
        attributes: ['id','name']
        },
        {
          model: db.role, as: "Role",
          include: [
            {
            model: db.permission, as: "Permission"
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
            jabatan:users.jabatan,
            role: users.Role
            .map(Role => {
            //   //tidy up the roles data
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
      if(resObj.length){
        return res.json(resObj[0])
       }
       else return res.send({message:"User doesnt exist"})     
    });
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  UpdateUsers: async (req, res, next) => {
    try { 
      id = req.body.id;
      username = req.body.username;
      email = req.body.email;
      password = req.body.password;
      role = req.body.role;
      jabatan_fungsional = req.body.jabatan_fungsional;
      jabatan_struktual = req.body.jabatan_struktual;
      avatar = req.body.avatar;
      office_number = req.body.office_number;
      personal_number = req.body.personal_number;
      jabatanId = req.body.jabatanId;
      blacklist = req.body.blacklist;
                
      let result = await db.users.findAndCountAll({
        raw: true,
        where: {
          id: id
        }
      })
                
      if(result.count&&password){
        bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
        }
        const update = {
          email: email,
          username:username,
          password: hash,
          role: role,
          jabatan_fungsional: jabatan_fungsional,
          jabatan_struktual: jabatan_struktual,
          avatar: avatar,
          office_number: office_number,
          personal_number: personal_number,
          blacklist:blacklist,
          jabatanId:jabatanId
        };
        db.users.update(
          update,{ 
            where: { 
              id: id 
            } 
          }).then(data =>{
            return res.send({message:"update successfull"})
          })       
        });
      }
      else if(result.count){
        const update = {
          email: email,
          username:username,
          role: role,
          jabatan_fungsional: jabatan_fungsional,
          jabatan_struktual: jabatan_struktual,
          avatar: avatar,
          office_number: office_number,
          personal_number: personal_number,
          blacklist:blacklist,
          jabatanId:jabatanId
        };
        db.users.update(
          update,{ 
            where: { 
              id: id 
            } 
          })    
        }
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  CreateUsers: async (req, res, next) => {
    try { 
      username = req.body.username;
      email = req.body.email;
      password = req.body.password;
      role = req.body.role;
      jabatanId = req.body.jabatanId;
      jabatan_fungsional = req.body.jabatan_fungsional;
      jabatan_struktual = req.body.jabatan_struktual;
      avatar = req.body.avatar;
      office_number = req.body.office_number;
      personal_number = req.body.personal_number;
      blacklist = req.body.blacklist;
      id = uuidv4();

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
           console.log(err);
        }
      const createUser = {
        id: id, 
        email: email,
        username:username,
        password: hash,
        role: role,
        jabatan_fungsional: jabatan_fungsional,
        jabatan_struktual: jabatan_struktual,
        avatar: avatar,
        office_number: office_number,
        personal_number: personal_number,
        blacklist:blacklist,
        jabatanId:jabatanId
      };
              
      db.users.create(createUser)
        .then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating jabatan"
          });
        });          
      });   
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
        }
    },
  DeleteUsers: async (req, res, next) => {
    try { 
          id = req.body.id;
                    
          db.users.destroy({
            where: {
              id:id
              }
          }).then(data =>{
            return res.send({message:"delete successfull"})
          }
          ).catch(err => {
            return res.status(500).send({
            message:
              err.message || "Some error occurred while users jabatan"
            });
          });        
        }catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
    },
  //CRUD Jabatan
  ReadJabatan: async (req, res, next) => {
        try { 
          id = req.body.id;
              
          let result = await db.jabatan.findAll({
            // raw: true,
            attributes: ['id','name', 'parent_id',
            [Sequelize.fn('count', Sequelize.col('users.id')) ,'UserCount'] 
          ],
            include: [
              {
                model: db.users,
                attributes: [] 
              }
                
            ],
            group: ['jabatans.id']
            // attributes: ['name',  'root_parent_id', 'parent_id']
            // where: {
            //   id: id
            // }
          })
              
          page_number=req.body.page;
          page_size=2;
          if(result.length){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
          }
          else return res.send({message:"data jabatan is empty!"})
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  SearchJabatan: async (req, res, next) => {
          try { 
            id = req.body.id;
                
            let result = await db.jabatan.findAndCountAll({
              // raw: true,
              attributes:['name','description','level'],
              include: [
                {
                  model: db.users,
                  attributes: ['id'] 
                }
                  
              ],
              where: {
                id: id
              }
            })
                
            if(result.count){
             return res.json(result.rows[0])
          }
        }catch (error) {
          if (error.isJoi === true) error.status = 422
            next(error)
            }
          },
  CreateJabatan: async (req, res, next) => {
    try { 
      root_parent_id = req.body.root_parent_id;
      userId = req.body.user_id;
      parent_id = req.body.parent_id;
      nameJabatan = req.body.name;
      description = req.body.description;
      level = req.body.level;
      id = uuidv4();

      const createJabatan = {
        id: id,
        userId: userId,
        root_parent_id: root_parent_id,
        parent_id:parent_id,
        name: nameJabatan,
        description: description,
        level: level
      };
      db.jabatan.create(createJabatan)
        .then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({
          message:
            err.message || "Some error occurred while creating jabatan"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  UpdateJabatan: async (req, res, next) => {
      try { 
        id = req.body.id,
        userId = req.body.user_id;
        root_parent_id = req.body.root_parent_id,
        parent_id = req.body.parent_id,
        nameJabatan = req.body.name;
        description = req.body.description;
        level = req.body.level;
        
        let result = await db.jabatan.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            root_parent_id: root_parent_id,
            userId:userId,
            parent_id:parent_id,
            name: nameJabatan,
            description: description,
            level: level
          };
          console.log(update)
          db.jabatan.update(
            update,{ 
              where: { 
                id: id 
              } 
            }).then(data =>{
              return res.send({message:"update successfull"})
            })    
        }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeleteJabatan: async (req, res, next) => {
    try { 
      id = req.body.id;

      db.jabatan.destroy({
        where: {
          id:id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete jabatan"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  //CRUD Roles
  ReadRoles: async (req, res, next) => {
    try { 
      id = req.body.id;
          
      let result = await db.role.findAll({
        attributes: ['name', 'system_environment',
        [Sequelize.fn('count', Sequelize.col('Permission.id')) ,'PermissionCount'],
        [Sequelize.fn('count', Sequelize.col('User.id')) ,'UserCount'], 
      ],
        include: [
          {
            model: db.permission, as: "Permission",
            attributes: [] 
          },
          {
            model: db.users, as: "User",
            attributes: [] 
          }
            
        ],
        group: ['roles.id']
        
        // raw:true
        // where: {
        //   id: id
        // }
      })
         
      page_number=req.body.page;
      page_size=2;
      if(result.length){
       return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
      }
      else return res.send({message:"data roles is empty!"})
  }catch (error) {
    if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  SearchRoles: async (req, res, next) => {
      try { 
        id = req.body.id;
            
        // let result = 
        await db.role.findAll({
          include: [
            {
              model: db.permission, as: "Permission",
              attributes:['id']
            },
            {
              model: db.users, as: "User",
              attributes:['id']
            }
          ],
          where: {
            id: id
          }
        }).then(
          role => {
          const resObj = role.map(role => {    
            //tidy up the user data
            return Object.assign(
              {},
              {
                rolesid: role.id,
                name: role.name,
                system: role.system_environment,
                permission: role.Permission
                .map(Permission => {    
                //   //tidy up the roles data
                  return Object.assign(
                    {},
                    {
                      permissionId: Permission.id
                    }
                    )
                }),
                user: role.User
                .map(User => {    
                //   //tidy up the roles data
                  return Object.assign(
                    {},
                    {
                      userId: User.id
                    }
                    )
                })
              }
            )
          });
          // console.log(resObj)   
          if(resObj.length){
            return res.json(resObj[0])
           }
           else return res.send({message:"Role doesnt exist"})     
        });      
      //   if(result.count){
      //    return res.json(result.rows[0])
      // }
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  CreateRoles: async (req, res, next) => {
      try { 
        id = uuidv4();
        userId = req.body.user_id;
        nameRoles = req.body.name;
        description = req.body.description;
        system_environment = req.body.system_environment;
        domain_environment = req.body.domain_environment;
  
        // db.role.addProject(project, { through: { role: 'manager' }});
        const createRoles = {
          id:id,
          userId:userId,
          name: nameRoles,
          description:description,
          domain_environment: domain_environment,
          system_environment: system_environment
        };
  
        db.role.create(createRoles)
          .then(data => {
            res.send(data);
          }).catch(err => {
            console.log(err)
          //   res.status(500).send({
          //   message:
          //     err.message || "Some error occurred while creating roles"
          // });
        });       
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  UpdateRoles: async (req, res, next) => {
      try { 
        id = req.body.id;
        userId = req.body.user_id;
        nameRoles = req.body.name;
        description = req.body.description;
        system_environment = req.body.system_environment;
        domain_environment = req.body.domain_environment;
        
        let result = await db.role.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            id:id,
            userId: userId,
            name: nameRoles,
            description:description,
            domain_environment: domain_environment,
            system_environment: system_environment
          };
          console.log(update)
          db.role.update(
            update,{ 
              where: { 
                id: id 
              } 
            }).then(data =>{
              return res.send({message:"update successfull"})
            })       
        }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeleteRoles: async (req, res, next) => {
    try { 
      id = req.body.id;
                
      db.role.destroy({
        where: {
          id:id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete roles"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  //CRUD Permission
  ReadPermission: async (req, res, next) => {
    try { 
      id = req.body.id;
          
      let result = await db.permission.findAll({
        // raw: true, 
        attributes:[
          'name', 'system_environment',
        [Sequelize.fn('count', Sequelize.col('Role.id')) ,'RoleCount'] 
      ],
        
        include: [
          {
            model: db.role, as: "Role",
            attributes: [] 
          }
            
        ],
        group: ['permissions.id']        
        // where: {
        //   id: id
        // }
      })
        
      page_number=req.body.page;
      page_size=2;
      if(result.length){
       return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
      }
      else return res.send({message:"data permissions is empty!"})
  }catch (error) {
    if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  SearchPermission: async (req, res, next) => {
      try { 
        id = req.body.id;            
        // let result = 
        await db.permission.findAll({
          // raw: true, 
          include: [
            {
              model: db.role, as: "Role"
            }
          ],
          where: {
            id: id
          }
        }).then(
          permission => {
          const resObj = permission.map(permission => {    
            //tidy up the user data
            return Object.assign(
              {},
              {
                permissionId: permission.id,
                name: permission.name,
                description: permission.description,
                // jabatan:users.jabatan,
                role: permission.Role
                .map(Role => {
    
                //   //tidy up the roles data
                  return Object.assign(
                    {},
                    {
                      roleId: Role.id,
                //       userId: Role.userId,
                //       name: Role.name,
                //       system:Role.system_environment,
                //       description: Role.description, 
                //       permission:Role.Permission
                //       .map(Permission => {
    
                // //         //tidy up the permission data
                //         return Object.assign(
                //           {},
                //           {
                //             permissionId: Permission.id,
                //             // roleId: permissions.roleId,
                //             // name: permissions.name,
                //             // description: permissions.description
                //           }
                //         )
                //       })
                    }
                    )
                })
              }
            )
          });   
          if(resObj.length){
            return res.json(resObj[0])
           }
           else return res.send({message:"Pemission doesnt exist"})     
        });
            
      //   if(result.count){
      //    return res.json(result.rows[0])
      // }
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  CreatePermissions: async (req, res, next) => {
    try { 
      id = uuidv4();
      roleId = req.body.role_id;
      namePermission = req.body.name;
      description = req.body.description;
      system_environment = req.body.system_environment;
      domain_environment = req.body.domain_environment;

      const CreatePermissions = {
        id:id,
        roleId: roleId,
        name: namePermission,
        description:description,
        domain_environment: domain_environment,
        system_environment: system_environment
      };

      db.permission.create(CreatePermissions)
        .then(data => {
          res.send(data);
        }).catch(err => {
          return res.status(500).send({
          message:
            err.message || "Some error occurred while creating roles"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  UpdatePermissions: async (req, res, next) => {
      try { 
        id = req.body.id;
        namePermission = req.body.name;
        roleId = req.body.role_id;
        description = req.body.description;
        system_environment = req.body.system_environment;
        domain_environment = req.body.domain_environment;
        
        let result = await db.permission.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            id:id,
            roleId: roleId,
            name: namePermission,
            description:description,
            domain_environment: domain_environment,
            system_environment: system_environment
          };
          console.log(update)
          db.permission.update(
            update,{ 
              where: { 
                id: id 
              } 
            }).then(data =>{
              return res.send({message:"update successfull"})
            })       
        }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeletePermissions: async (req, res, next) => {
    try { 
      id = req.body.id;

      db.permission.destroy({
        where: {
          id:id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete permission"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  // //CRUD RolePermission
  SearchRolePermission: async (req, res, next) => {
      try { 
        role_id = req.body.role_id;
        permission_id = req.body.permission_id;
        
        let result =  db.RolePermission.findAll({
          where:{
            roleId:role_id,
            permissionId:permission_id
          }
        })
            
        if(result.count){
         return res.json(result.rows[0])
      }
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  ReadRolePermission: async (req, res, next) => {
        try { 
          role_id = req.body.role_id;
          permission_id = req.body.permission_id;
          
          let result =  db.RolePermission.findAll({
            // where:{
            //   roleId:role_id,
            //   permissionId:permission_id
            // }
          })
              
          page_number=req.body.page;
          page_size=2;
          if(result.length){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
          }
          else return res.send({message:"data roles_permissions is empty!"})
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  CreateRolePermission: async (req, res, next) => {
    try { 
      id = uuidv4();
      role_id = req.body.role_id;
      permission_id = req.body.permission_id;
      const role= await db.role.findByPk(role_id);
     
      console.log(role)
      const permission=await db.permission.findByPk(permission_id);
      await permission.addRole(role);
      const permissionAll=await db.permission.findAll({
        include: [
          {
            model: db.role, as: "Role"
          }
        ]
      });
      // console.log(permissionAll);
      const RolePermission=await db.RolePermission.findAll({
        where:{
          roleId:role_id,
          permissionId:permission_id
        }
      })
      return res.json(RolePermission)
      // const permission=db.permission.findAll({
      //   where: {
      //     id: permissionId
      //   }
      // });
      // await role.addpermission(permission, { roleId: roleId, permissionId: permissionId }); 
      // const CreatePermissions = {
      //   id:id,
      //   roleId: roleId,
      //   name: namePermission,
      //   description:description,
      //   domain_environment: domain_environment,
      //   system_environment: system_environment
      // };

      // const createPermission=db.permission.create(CreatePermissions)
      //   .then(data => {
      //     res.send(data);
      //   }).catch(err => {
      //     res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating roles"
      //   });
      // });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  UpdateRolePermission: async (req, res, next) => {
      try { 
      role_id = req.body.role_id;
      permission_id = req.body.permission_id; 
      new_permission_id = req.body.new_permission_id; 
      new_role_id = req.body.new_role_id; 
      const update={
        roleId:new_role_id,
        permissionId:new_permission_id
      }
      db.RolePermission.update(
        update,{ 
          where: { 
          roleId:role_id,
          permissionId:permission_id
          } 
        }).then(data =>{
          return res.send({message:"update successfull"})
        })       
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeleteRolePermission: async (req, res, next) => {
    try { 
      role_id = req.body.role_id;
      permission_id = req.body.permission_id; 
                
      db.RolePermission.destroy({
        where: {
          roleId:role_id,
          permissionId:permission_id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete RolePermission"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  // //CRUD UserRole
  SearchUserRole: async (req, res, next) => {
      try { 
        role_id = req.body.role_id;
        user_id = req.body.user_id;
        
        let result =  db.UserRole.findAll({
          where:{
            roleId:role_id,
            userId:user_id
          }
        })
            
        if(result.count){
         return res.json(result.rows[0])
      }
    }catch (error) {
      if (error.isJoi === true) error.status = 422
        next(error)
        }
      },
  ReadUserRole: async (req, res, next) => {
        try { 
          role_id = req.body.role_id;
          user_id = req.body.user_id;
          
          let result =  db.UserRole.findAll({
            // where:{
            //   roleId:role_id,
            //   permissionId:permission_id
            // }
          })
              
          page_number=req.body.page;
          page_size=2;
          if(result.length){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
          }
          else return res.send({message:"data user_roles is empty!"})
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  CreateUserRole: async (req, res, next) => {
    try { 
      id = uuidv4();
      role_id = req.body.role_id;
      user_id = req.body.user_id;
      const role= await db.role.findByPk(role_id);
     

      const user=await db.users.findByPk(user_id);
      await user.addRole(role);
      const userAll=await db.users.findAll({
        include: [
          {
            model: db.role, as: "Role"
          }
        ]
      });
      // console.log(permissionAll);
      const UserRole=await db.UserRole.findAll({
        where:{
          roleId:role_id,
          userId:user_id
        }
      })
      res.json(UserRole)
      // const permission=db.permission.findAll({
      //   where: {
      //     id: permissionId
      //   }
      // });
      // await role.addpermission(permission, { roleId: roleId, permissionId: permissionId }); 
      // const CreatePermissions = {
      //   id:id,
      //   roleId: roleId,
      //   name: namePermission,
      //   description:description,
      //   domain_environment: domain_environment,
      //   system_environment: system_environment
      // };

      // const createPermission=db.permission.create(CreatePermissions)
      //   .then(data => {
      //     res.send(data);
      //   }).catch(err => {
      //     res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating roles"
      //   });
      // });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  UpdateUserRole: async (req, res, next) => {
      try { 
      role_id = req.body.role_id;
      user_id = req.body.user_id;
      new_permission_id = req.body.new_permission_id; 
      new_role_id = req.body.new_role_id; 
      const update={
        roleId:new_role_id,
        userId :user_id
      }
      db.UserRole.update(
        update,{ 
          where: { 
          roleId:role_id,
          userId: user_id
          } 
        }).then(data =>{
          return res.send({message:"update successfull"})
        })       
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeleteUserRole: async (req, res, next) => {
    try { 
      role_id = req.body.role_id;      
      user_id = req.body.user_id;
                
      db.UserRole.destroy({
        where: {
          roleId:role_id,      
          userId:user_id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete RolePermission"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  //CRUD Document
  CreateDocument: async (req, res, next) => {
    try { 
      id = uuidv4();
      pasal = req.body.pasal;
      isi = req.body.isi;
      const token = req.cookies['token']
      var decoded = jwt_decode(token);  
      created_by = decoded.id;
      const CreateDocument = {
        id:id,
        pasal: pasal,
        isi:isi,
        created_by: created_by
      };

      db.Document.create(CreateDocument)
        .then(data => {
          console.log(data)
          // res.send(data);
        }).catch(err => {
          res.status(500).send({
          message:
            err.message || "Some error occurred while creating roles"
        });
      });        
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
  UpdateDocument: async (req, res, next) => {
      try { 
        id = uuidv4();
        pasal = req.body.pasal;
        isi = req.body.isi;
        created_by = req.body.created_by;

        let result = await db.Document.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            id:id,
            pasal: pasal,
            isi:isi,
            created_by: created_by
          };
          console.log(update)
          db.Document.update(
            update,{ 
              where: { 
                id: id 
              } 
            }).then(data =>{
              return res.send({message:"update successfull"})
            })       
        }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
    },
  DeleteDocument: async (req, res, next) => {
    try { 
      id = req.body.id;
                
      db.Document.destroy({
        where: {
          id:id
          }
      }).then(data =>{
        return res.send({message:"delete successfull"})
      }
      ).catch(err => {
        return res.status(500).send({
        message:
          err.message || "Some error occurred while delete document"
        });
      });        
 
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
}