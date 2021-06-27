const Sequelize = require('sequelize');

const db = new Sequelize({
    "logging": false,
    "dialect": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "A_lex 123",
    "database": "cabox-dev",
    "define": {
      "underscored": true,
      "timestamps": false
    }
});

module.exports = db;