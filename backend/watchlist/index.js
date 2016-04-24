'use strict';

var Imdb    = require('./imdb'),
    imdb    = new Imdb();

class Watchlist {
  constructor(){

  }

  setConfig(){
    
  }

  getConfig(){
    
  }

  toJSON(){
    
  }

  downloadBacklog(){
    
  }
}

module.exports = {
  test:            imdb.test.bind(imdb),
  downloadBacklog: imdb.downloadBacklog.bind(imdb)
};