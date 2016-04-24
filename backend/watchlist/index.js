'use strict';

var Imdb    = require('./imdb'),
imdb = new Imdb({url: 'http://www.imdb.com/user/ur34552897/watchlist?title_type=movie'});

// function noop(){
//   return new Promise((f) => { f(); });
// }

// class Watchlist {
//   constructor(){
//     this.watchlists = [];
//   }

//   setConfig(config){
//     this.config     = config;
//     this.watchlists = config.map(item => {
//       if (item.type === 'imdb'){
//         new Imdb({url: item.url});
//       }
//       else {
//         throw(`unknown watchlist type: ${item.type}`);
//       }
//     });
//   }

//   getConfig(){
//     return this.config;
//   }

//   toJSON(){
//     return {
//       watchlists: this.watchlists.map(wl => { wl.toJSON() })
//     }
//   }

//   downloadBacklog(lastCheckedAt, iterator){
//     if (this.watchlists.length === 0) return noop();

//     return Promise.all(this.watchlists.map(wl => {
//       return wl.downloadBacklog(lastCheckedAt, iterator);
//     }));
//   }
// }

module.exports = {
  test:            imdb.test.bind(imdb),
  downloadBacklog: imdb.downloadBacklog.bind(imdb)
};