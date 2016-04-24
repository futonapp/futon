'use strict';

class AbstractBase {
  name(){}

  test(callback){
    throw('subclass must implement this method');
  }

  downloadBacklog(){
    // return Readable
    throw('subclass must implement this method');
  }
}

module.exports = AbstractBase;