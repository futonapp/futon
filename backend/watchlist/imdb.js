'use strict';

var AbstractWatchlist  = require('./abstract_watchlist'),
    jsdom              = require('jsdom'),
    request            = require('superagent'),
    url                = require('url'),
    logger             = require('../logger').getLogger('Watchlist::IMDB'),
    Readable           = require('stream').Readable;

function parseWatchlistReponse($){
  var results = [];

  $('.lister-item').each(function(i, el){
    el = $(el);
    results.push({
      title:   el.find("h3.lister-item-header a").text(),
      year:    el.find(".lister-item-year").text().replace(/.*\((\d\d\d\d)\).*/, '$1'),
      imdb_id: el.find(".lister-item-image").attr('data-tconst'),
    });
  });

  return results;
}

function crawlWatchlist(watchlistUrl, callback){
  jsdom.env(
    watchlistUrl,
    ["http://code.jquery.com/jquery.js"],
    (error, window) => {
      if (error){
        callback(error);
        return;
      }

      var movies       = parseWatchlistReponse(window.$),
          nextPageHref = window.$(".footer .nav .desc a.next-page").attr('href'),
          nextPage     = !!nextPageHref ? url.resolve(watchlistUrl, nextPageHref) : null; 
      
      callback(null, {
        movies: movies,
        nextPage: nextPage
      })
    }
  );
}

class Imdb extends AbstractWatchlist {
  constructor(){
    super();
    this.watchlistUrl = "http://www.imdb.com/user/ur34552897/watchlist?title_type=movie";
  }

  test(callback){
    var rs = this.downloadBacklog();

    rs.on('data', _ => {});
    rs.on('error', (error) => {
      if (typeof callback === 'function') callback(error);
    });

    rs.on('end', function(){
      if (typeof callback === 'function') callback();
    });
  }

  downloadBacklog(lastCheckedAt, iterator){
    return new Promise((fulfill, reject) => {
      var currentUrl = this.watchlistUrl;
      logger.debug('crawling watchlist url: ' + currentUrl);
      if (currentUrl){
        crawlWatchlist(currentUrl, (error, response) => {
          if (error){
            logger.error(error);
            reject(error);
            return;
          }
          currentUrl = response.nextPage;
          logger.info('got ' + response.movies.length + ' movies');
          response.movies.forEach(movie => {
            if (!movie.title || !movie.year || !movie.imdb_id){
              logger.warn('ignoring', movie);
              return;
            }
            iterator(movie);
          });
        });
      }
      else {
        fulfill();
      }
    });  
  }
}

module.exports = Imdb;