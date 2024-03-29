const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const BlacklistToken = sequelize.define("blacklist_token", {
    id: {
    type: DataTypes.STRING,
    // defaultValue: uuidv4(),
    primaryKey:true, 
    allowNull: false
  },
  token: DataTypes.STRING(500)
});
return BlacklistToken;
};