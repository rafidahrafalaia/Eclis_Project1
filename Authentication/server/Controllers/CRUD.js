const bcrypt = require("bcrypt");
const conn=require("../database/connection")
const Users=conn.users;
const Permissions=conn.permission;
const Jabatan=conn.jabatan;
const Roles=conn.role;
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');

module.exports = {
  //CRUD User
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
          
      let result = await Users.findAndCountAll({
        raw: true,
        where: {
          email: email
        }
      })
          
      if(result){
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
        console.log(update)
                  // // Save register in the database
        Users.update(
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
                    
          Users.destroy({
            where: {
              id:id
              }
          })
        }catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
    },
  //CRUD Jabatan
  CreateJabatan: async (req, res, next) => {
    try { 
      root_parent_id = req.body.root_parent_id;
      parent_id = req.body.parent_id;
      nameJabatan = req.body.name;
      description = req.body.description;
      level = req.body.level;
      id = uuidv4();

      const createJabatan = {
        id: id,
        root_parent_id: root_parent_id,
        parent_id:parent_id,
        name: nameJabatan,
        description: description,
        level: level
      };
      Jabatan.create(createJabatan)
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
        root_parent_id = req.body.root_parent_id,
        parent_id = req.body.parent_id,
        nameJabatan = req.body.name;
        description = req.body.description;
        level = req.body.level;
        
        let result = await Jabatan.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            root_parent_id: root_parent_id,
            parent_id:parent_id,
            name: nameJabatan,
            description: description,
            level: level
          };
          console.log(update)
          Jabatan.update(
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
                
      Jabatan.destroy({
        where: {
          id:id
          }
      })
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  //CRUD Roles
  CreateRoles: async (req, res, next) => {
    try { 
      id = uuidv4();
      nameRoles = req.body.name;
      description = req.body.description;
      system_environment = req.body.system_environment;
      domain_environment = req.body.domain_environment;

      const createRoles = {
        id:id,
        name: nameRoles,
        description:description,
        domain_environment: domain_environment,
        system_environment: system_environment
      };

      Roles.create(createRoles)
        .then(data => {
          res.send(data);
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
    UpdateRoles: async (req, res, next) => {
      try { 
        id = req.body.id;
        nameRoles = req.body.name;
        description = req.body.description;
        system_environment = req.body.system_environment;
        domain_environment = req.body.domain_environment;
        
        let result = await Roles.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            id:id,
            name: nameRoles,
            description:description,
            domain_environment: domain_environment,
            system_environment: system_environment
          };
          console.log(update)
          Roles.update(
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
                
      Roles.destroy({
        where: {
          id:id
          }
      })
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  //CRUD Permission
  CreatePermissions: async (req, res, next) => {
    try { 
      id = uuidv4();
      namePermission = req.body.name;
      description = req.body.description;
      system_environment = req.body.system_environment;
      domain_environment = req.body.domain_environment;

      const CreatePermissions = {
        id:id,
        name: namePermission,
        description:description,
        domain_environment: domain_environment,
        system_environment: system_environment
      };

      Permissions.create(CreatePermissions)
        .then(data => {
          res.send(data);
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
    UpdatePermissions: async (req, res, next) => {
      try { 
        id = req.body.id;
        namePermission = req.body.name;
        description = req.body.description;
        system_environment = req.body.system_environment;
        domain_environment = req.body.domain_environment;
        
        let result = await Roles.findAndCountAll({
          raw: true,
          where: {
            id: id
          }
        })
              
        if(result){
          const update = {
            id:id,
            name: namePermission,
            description:description,
            domain_environment: domain_environment,
            system_environment: system_environment
          };
          console.log(update)
          Permissions.update(
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
                
      Permissions.destroy({
        where: {
          id:id
          }
      })
    }catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
}