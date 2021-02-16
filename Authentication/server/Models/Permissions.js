const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Permissions = sequelize.define("permissions", {
    id: {
    type: DataTypes.STRING,
    allowNull: false,
    // defaultValue: uuidv4(),
    primaryKey:true
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  system_environment: DataTypes.STRING,
  domain_environment: DataTypes.STRING,
//   jabatan: DataTypes.STRING,
//   permission: DataTypes.STRING
});
return Permissions;
};