'use strict';

class AbstractWatchlist {
  name(){}

  test(callback){
    throw('subclass must implement this method');
  }

  downloadBacklog(){
    // return Readable
    throw('subclass must implement this method');
  }
}

module.exports = AbstractWatchlist;