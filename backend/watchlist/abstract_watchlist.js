'use strict';

class AbstractWatchlist {
  get meta(){
    throw('subclass must implement this method');
  }
  test(callback){
    throw('subclass must implement this method');
  }
  downloadBacklog(lastCheckedAt, iterator){
    throw('subclass must implement this method');
  }
}

module.exports = AbstractWatchlist;