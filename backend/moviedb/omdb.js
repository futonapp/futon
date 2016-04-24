'use strict';

var request          = require('superagent'), 
    AbstractMovieDB  = require('./abstract_moviedb'),
    logger           = require('../logger').getLogger('MovieAggregator::OMDB');

class Omdb extends AbstractMovieDB {
  test(callback){
    this.search("the revenant", function(e, movies){
      if (e){
        if (typeof callback === 'function') 
          callback(e);
        return;
      }
      if (typeof callback === 'function') 
        callback(movies.length > 0 ? null : 'no movies returned');
    });
  }

  enrich(movieAttribs, callback){
    var url,
        baseUrl = 'http://www.omdbapi.com';

    if (movieAttribs.imdb_id){
      url = baseUrl + '/?i=' + movieAttribs.imdb_id + '&y=&plot=full&r=json';
    }
    else if (movieAttribs.title) {
      url = baseUrl + '/?t=' + encodeURIComponent(movieAttribs.title) + '&plot=full&r=json';
    }
    else {
      callback('need imdb_id or title attributes');
      return;
    }
    logger.debug("querying", url);
    
    request
      .get(url)
      .set('Accept', 'application/json')
      .end(function(e, res){
        if (e){
          callback(e);
          return;
        }

        res = res.body;
        callback(null, {
          release_date: res['Released'],
          run_time:     res['Runtime'],
          genre:        res['Genre'],
          director:     res['Director'],
          writer:       res['Writer'],
          actors:       res['Actors'],
          plot:         res['Plot'],
          language:     res['Language'],
          country:      res['Country'],
          awards:       res['Awards'],
          poster_url:   res['Poster'],
          imdb_rating:  +res['imdbRating'],
          imdb_votes:   res['imdbVotes']
        });
      });
  }

  search(query, callback){
    var url      = 'http://www.omdbapi.com/?s=' + encodeURIComponent(query);

    logger.debug("searching for '" + query + "'");

    request
      .get(url)
      .set('Accept', 'application/json')
      .end(function(err, res){
         var results = res.body['Search'].map(function(item){
           return {
             title:       item['Title'],
             year:        item['Year'],
             imdb_id:     item['imdbID'],
             type:        item['Type'],
             poster_url:  (item['Poster'] == 'N/A' ? null : item['Poster'])
           };
         });

      callback(null, results);
     });
  }
}

module.exports = Omdb;