const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'root', 'Rahasia2', {
  host: 'localhost',
  dialect: 'mariadb',
  port:'8080' 
});
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Rahasia2",
    database: "database",
    port:"8080"
  });
  
  
const users = require("../Models/Users")(sequelize, Sequelize);
const permission = require("../Models/Permissions")(sequelize, Sequelize);
const jabatan = require("../Models/Jabatan")(sequelize, Sequelize);
const role = require("../Models/Role")(sequelize, Sequelize);
const BlacklistToken = require("../Models/BlacklistToken")(sequelize, Sequelize);
module.exports = {
    db: db,
    sequelize:sequelize,
    users: users,
    permission: permission,
    jabatan: jabatan,
    role: role,
    BlacklistToken:BlacklistToken
};
