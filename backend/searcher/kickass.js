'use strict';

var request          = require('request'), 
    zlib             = require('zlib'),
    parseString      = require('xml2js').parseString,
    AbstractSearcher = require('./abstract_searcher'),
    logger           = require('../logger').getLogger('TorrentAggregator::Kickass');

class Kickass extends AbstractSearcher {
  buildQuery(movie){
    return movie.title;
  }

  test(callback){
    this.search("the revenant", function(e, torrents){
      if (e){
        if (typeof callback === 'function') 
          callback(e);
        return;
      }
      if (typeof callback === 'function') 
        callback(torrents.length > 0 ? null : 'no torrent returned');
    });
  }

  search(query, callback){
    var url      = 'https://kat.cr/usearch/' + encodeURIComponent(query) + '/?rss=1&field=seeders&sorder=desc';
    var response = '';

    var headers = {
      'Accept-Encoding': 'gzip',
      'user-agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
    };

    logger.debug("searching for '" + query + "'");

    request({url: url, 'headers': headers})
        .pipe(zlib.createGunzip()) // unzip
        .on('data', function (chunk) {
            response += chunk.toString();
        })
        .on('end', function () {
            parseString(response, function (err, result) {
              if (err){
                callback(err);
                return;
              }
              var items   = result ? result.rss.channel[0].item : [];
              var results = items.map(function(item){
                return {
                  title:       item.title[0],
                  category:    item.category[0],
                  size:        +item['torrent:contentLength'][0],
                  seeds:       +item['torrent:seeds'][0],
                  magnet:      item['torrent:magnetURI'][0],
                  source_url:  item['link'][0]
                };
              });
              logger.debug("got " + results.length + " results");

              callback(null, results);
            });
        });
  }
}

module.exports = Kickass;