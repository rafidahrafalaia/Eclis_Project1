const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Document = sequelize.define("document", {
    id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    primaryKey:true, 
    allowNull: false
  },
  pasal: DataTypes.STRING,
  isi: DataTypes.STRING(1000),
  created_by: DataTypes.STRING,
//   jabatan: DataTypes.STRING,
//   permission: DataTypes.STRING
});
return Document;
};