'use strict';

class AbstractMovieDB {
  test(callback){
    throw('subclass must implement this method');
  }
  enrich(movieAttribs, callback){
    throw('subclass must implement this method');
  }
  search(query, callback){
    throw('subclass must implement this method');
  }
}

module.exports = AbstractMovieDB;