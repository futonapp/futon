'use strict';

var database = require('./database'),
    Movie    = require('./movie'),
    Torrent  = require('./torrent'),
    logger   = require('../logger').getLogger('Database'),
    fs       = require('fs'),
    path     = require('path');

Torrent.belongsTo(Movie);
Movie.hasMany(Torrent);

function initialize(){
  logger.info('initialising database...');

  var p = path.join(__dirname, '../../database.sqlite');

  return new Promise(function(fulfill, reject) {
    fs.access(p, fs.R_OK | fs.W_OK, (e) => {
      if (e){
        fulfill(database.sync({force: true}));
      }
      else {
        fulfill();
      }
    });
  });
}

module.exports = {
  Movie:      Movie,
  Torrent:    Torrent,
  initialize: initialize
}