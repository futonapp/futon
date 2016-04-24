'use strict';

var Imdb    = require('./imdb'),
    imdb    = new Imdb();

function downloadBacklog(interator){
  return new Promise((fulfill, reject) => {
    var backlogStream = imdb.downloadBacklog();

    backlogStream.on('data', (data) => {
      var movies = JSON.parse(data);
      movies.forEach( (movieAttribs) => {
        if (!movieAttribs.title || !movieAttribs.year || !movieAttribs.imdb_id){
          logger.warn('ignoring', !!movieAttribs.title, !!movieAttribs.year, !!movieAttribs.imdb_id, movieAttribs);
          return;
        }
        interator(movieAttribs);
      });
    });

    backlogStream.on('error', (e) => { reject(e); });
    backlogStream.on('end',    _  => { fulfill(); });
  });  
}

module.exports = {
  test:            imdb.test.bind(imdb),
  downloadBacklog: downloadBacklog
};