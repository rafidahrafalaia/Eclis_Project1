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
  name: {
    type:DataTypes.STRING,
    allowNull: false
  },
  description: {
    type:DataTypes.STRING,
    allowNull: false
  },
  system_environment: {
    type:DataTypes.STRING,
    allowNull: false
  },
  domain_environment: DataTypes.STRING
});
return Role;
};