const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Users = sequelize.define("users", {
    id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    primaryKey:true,
    allowNull: false
  },
  username: {
    type:DataTypes.STRING,
    allowNull: false
  },
  email: {
    type:DataTypes.STRING,
    allowNull: false
  },
  password: DataTypes.STRING(500),
  role: DataTypes.STRING,
  jabatan_fungsional: DataTypes.STRING,
  jabatan_struktual: DataTypes.STRING,
  avatar: DataTypes.STRING,
  office_number: DataTypes.STRING,
  personal_number: DataTypes.STRING,
  blacklist:{
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  }, 
  // permission: DataTypes.STRING
});
return Users;
};