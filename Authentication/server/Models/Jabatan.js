const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Jabatan = sequelize.define("jabatan", {
    root_parent_id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    // primaryKey:true
  },
  parent_id: DataTypes.STRING,
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  level: DataTypes.STRING,
//   domain_environment: DataTypes.STRING,
//   jabatan: DataTypes.STRING,
//   permission: DataTypes.STRING
});
return Jabatan;
};