require("dotenv").config();
const { MYSQL_USERNAME, MYSQL_HOSTNAME, MYSQL_DATABASE } = process.env;
const { Sequelize, QueryTypes } = require("sequelize");
const seq = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, "", {
  host: MYSQL_HOSTNAME,
  dialect: "mysql",
});

module.exports = { seq, QueryTypes };
