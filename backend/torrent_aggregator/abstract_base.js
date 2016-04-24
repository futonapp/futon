'use strict';

class AbstractBase {
  test(callback){
    throw('subclass must implement this method');
  }

  search(query, callback){
    throw('subclass must implement this method');
  }
}

module.exports = AbstractBase;