const { Sequelize, QueryTypes } = require("sequelize");
const seq = new Sequelize("db_product", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = { seq, QueryTypes };
