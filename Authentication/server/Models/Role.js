const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Role = sequelize.define("roles", {
    id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    primaryKey:true,
    allowNull: false
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  system_environment: DataTypes.STRING,
  domain_environment: DataTypes.STRING
});
return Role;
};