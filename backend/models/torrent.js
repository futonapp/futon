'use strict';

var database          = require('./database'),
    Sequelize         = require('sequelize'),
    ptn               = require('parse-torrent-name'),
    logger            = require('../logger').getLogger('Movie');

var Torrent = database.define('torrent', {
  title:        { type: Sequelize.STRING },
  size:         { type: Sequelize.INTEGER },
  seeds:        { type: Sequelize.INTEGER },
  magnet:       { type: Sequelize.TEXT },
  source_url:   { type: Sequelize.STRING }
}, {
  underscored: true,
  instanceMethods:  
  {
    parseTitle: function(){
      console.log(ptn(this.title));
    },
    toJSON: function(){
      return {
        title:        this.title,
        size:         this.size,
        seeds:        this.seeds,
        magnet:       this.magnet,
        source_url:   this.source_url
      }
    }
  }
});

module.exports = Torrent;