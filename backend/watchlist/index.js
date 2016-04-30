'use strict';

var Imdb    = require('./imdb'),
imdb = new Imdb({url: 'http://www.imdb.com/user/ur34552897/watchlist?title_type=movie'});

function noop(){
  return new Promise((f) => { f(); });
}

class Watchlist {
  constructor(){
    this.providers = [];
  }

  setConfig(config){
    this.config     = config;
    this.providers = config.map(item => {
      if (item.type === 'imdb'){
        return new Imdb({url: item.url});
      }
      else {
        throw(`unknown watchlist type: ${item.type}`);
      }
    });
  }

  getConfig(){
    return this.config;
  }

  toJSON(){
    return {
      providers: this.providers.map(wl => { return wl.toJSON(); })
    }
  }

  downloadBacklog(lastCheckedAt, iterator){
    if (this.providers.length === 0) return noop();
    
    return Promise.all(this.providers.map(wl => {
      return wl.downloadBacklog(lastCheckedAt, iterator);
    }));
  }
}

module.exports = new Watchlist;
