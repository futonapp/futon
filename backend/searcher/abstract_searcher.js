'use strict';

class AbstractSearcher {
  test(callback){
    throw('subclass must implement this method');
  }

  search(query, callback){
    throw('subclass must implement this method');
  }
}

module.exports = AbstractSearcher;