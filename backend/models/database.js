'use strict';

var logger    = require('../logger').getLogger('Database'),
    Sequelize = require('sequelize');

var database = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  // logging: false,

  pool: {
    max:  5,
    min:  0,
    idle: 10000
  }
});

module.exports = database;