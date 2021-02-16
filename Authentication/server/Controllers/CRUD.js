const bcrypt = require("bcrypt");
const conn=require("../database/connection")
const db=conn.sequelize;
const jwt_decode = require('jwt-decode');
// const Permissions=conn.permission;
// const Jabatan=conn.jabatan;
// const Roles=conn.role;
const saltRounds = 10;
// const { Sequelize, Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const Role_Permission = require("../Models/Role_Permission");
// const sequelize = new Sequelize('mariadb');

const Sequelize = require("sequelize");
module.exports = {
  //CRUD User
  ReadUsersROlePermission: async (req, res, next) => {
    try { 
        const users = await db.users.findAll( 
        {  
          include: [
            {
              model: db.role,
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
        if(result){
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
          // username = req.body.username;
          // email = req.body.email;
          // password = req.body.password;
          // role = req.body.role;
          // jabatan_fungsional = req.body.jabatan_fungsional;
          // jabatan_struktual = req.body.jabatan_struktual;
          // avatar = req.body.avatar;
          // office_number = req.body.office_number;
          // personal_number = req.body.personal_number;
          // blacklist = req.body.blacklist;
          id = req.body.id;
              
          let result = await db.users.findAll({
            // raw: true,
            attributes:[
              'username', 'email',
              [Sequelize.fn('count', Sequelize.col('roles.id')) ,'RoleCount'],
              // [Sequelize.fn('count', Sequelize.col('roles.id')) ,'JabatanCount']
             
          ],
            
          // limit: 2,
          // offset: 1,
          include: [
            {
              model: db.role,
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
          if(result){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
        }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
        SearchUsers: async (req, res, next) => {
          try { 
            // username = req.body.username;
            // email = req.body.email;
            // password = req.body.password;
            // role = req.body.role;
            // jabatan_fungsional = req.body.jabatan_fungsional;
            // jabatan_struktual = req.body.jabatan_struktual;
            // avatar = req.body.avatar;
            // office_number = req.body.office_number;
            // personal_number = req.body.personal_number;
            // blacklist = req.body.blacklist;
            id = req.body.id;
                
            let result = await db.users.findAndCountAll({
              raw: true,
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
      UpdateUsers: async (req, res, next) => {
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
                
            let result = await db.users.findAndCountAll({
              raw: true,
              where: {
                email: email
              }
            })
                
            if(result.count){
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
                blacklist:blacklist
              };
              // console.log(update)

              db.users.update(
                update,{ 
                  where: { 
                    email: email 
                } 
              })    
            });
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
              jabatan_fungsional = req.body.jabatan_fungsional;
              jabatan_struktual = req.body.jabatan_struktual;
              avatar = req.body.avatar;
              office_number = req.body.office_number;
              personal_number = req.body.personal_number;
              blacklist = req.body.blacklist;
              id = uuidv4();

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
                blacklist:blacklist
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
          }catch (error) {
            if (error.isJoi === true) error.status = 422
              next(error)
              }
            },
  DeleteUsers: async (req, res, next) => {
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
          blacklist = req.body.blacklist;
                    
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
            attributes: ['name', 'parent_id',
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
          if(result){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
       }
      }catch (error) {
        if (error.isJoi === true) error.status = 422
          next(error)
          }
        },
  SearchJabatan: async (req, res, next) => {
          try { 
            id = req.body.id;
                
            let result = await db.jabatan.findAndCountAll({
              raw: true,
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
      nameJabatan = req.body.name;
      description = req.body.description;
      level = req.body.level;
                
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
        [Sequelize.fn('count', Sequelize.col('Permission.id')) ,'PermissionCount'] 
      ],
        include: [
          {
            model: db.permission, as: "Permission",
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
      if(result){
       return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
  }
  }catch (error) {
    if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
    SearchRoles: async (req, res, next) => {
      try { 
        id = req.body.id;
            
        let result = await db.role.findAndCountAll({
          include: [
            {
              model: db.permission, as: "Permission"
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
      nameRoles = req.body.name;
      description = req.body.description;
      system_environment = req.body.system_environment;
      domain_environment = req.body.domain_environment;
                
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
      if(result){
       return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
   }
  }catch (error) {
    if (error.isJoi === true) error.status = 422
      next(error)
      }
    },
    SearchPermission: async (req, res, next) => {
      try { 
        id = req.body.id;
            
        let result = await db.permission.findAndCountAll({
          raw: true, 
          include: [
            {
              model: db.role, as: "Role"
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
      namePermission = req.body.name;
      description = req.body.description;
      system_environment = req.body.system_environment;
      domain_environment = req.body.domain_environment;
                
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
  // //CRUD Permission
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
          if(result){
           return res.json(result.slice((page_number - 1) * page_size, page_number * page_size))
       }
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
      res.json(RolePermission)
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
      // namePermission = req.body.name;
      // description = req.body.description;
      // system_environment = req.body.system_environment;
      // domain_environment = req.body.domain_environment;
                
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