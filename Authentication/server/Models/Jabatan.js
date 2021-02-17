const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Jabatan = sequelize.define("jabatans", {
    root_parent_id: {
    type: DataTypes.STRING
    // defaultValue: uuidv4(),
    // primaryKey:true
  },
  id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    primaryKey:true
  },
  parent_id: DataTypes.STRING,
  name: {
    type:DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.STRING,
  level: {
    type:DataTypes.STRING,
    allowNull: false
  },
//   domain_environment: DataTypes.STRING,
//   jabatan: DataTypes.STRING,
//   permission: DataTypes.STRING
});
return Jabatan;
};