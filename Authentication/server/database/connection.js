const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'root', 'Rahasia2', {
  host: 'localhost',
  dialect: 'mariadb',
  port:'8080' 
});

  sequelize.users = require("../Models/Users")(sequelize, Sequelize);
  sequelize.permission = require("../Models/Permissions")(sequelize, Sequelize);
  sequelize.jabatan = require("../Models/Jabatan")(sequelize, Sequelize);
  sequelize.role = require("../Models/Role")(sequelize, Sequelize);
  sequelize.BlacklistToken = require("../Models/BlacklistToken")(sequelize, Sequelize);
  sequelize.Document = require("../Models/Document")(sequelize, Sequelize);
  sequelize.RolePermission = require("../Models/Role_Permission")(sequelize, Sequelize);
  sequelize.UserRole = require("../Models/User_Role")(sequelize, Sequelize);

  sequelize.permission.belongsToMany(sequelize.role,{ as: 'Role', through: sequelize.RolePermission })
  sequelize.role.belongsToMany(sequelize.permission,{ as: 'Permission', through: sequelize.RolePermission })
  // sequelize.permission.belongsTo(sequelize.role)
  // sequelize.role.hasMany(sequelize.permission)
  sequelize.role.belongsToMany(sequelize.users,{ as: 'User', through:  sequelize.UserRole })
  sequelize.users.belongsToMany(sequelize.role,{ as: 'Role', through:  sequelize.UserRole })
  sequelize.jabatan.hasMany(sequelize.users)
  sequelize.users.belongsTo(sequelize.jabatan)
  sequelize.Document.belongsTo(sequelize.users, {foreignKey: 'created_by'})
  sequelize.users.hasMany(sequelize.Document, {foreignKey: 'created_by'})

  module.exports = {
    // db: db,
    sequelize:sequelize
};
