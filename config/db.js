const { Sequelize, QueryTypes } = require("sequelize");
const seq = new Sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
 
});

module.exports = { seq, QueryTypes };
