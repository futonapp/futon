'use strict';

var Imdb   = require('../../backend/watchlist/imdb');

describe('Imdb', function() {
  describe('#downloadBacklog()', function () {
    it('should return the movie list', function () {
      var imdb = new Imdb({url: 'http://www.imdb.com/user/ur34552897/watchlist?title_type=movie'});

      sinon.stub(Imdb, "crawlWatchlist", (watchlistUrl, callback) => {
        callback(null, {
          movies: [{
            title: 'some movie',
            year: '2014',
            imdb_id: '123',
          }],
          nextPage: null
        });
      });

      return imdb.downloadBacklog(null, (movie) => {
               movie.should.have.property('title', 'some movie');
               movie.should.have.property('year', '2014');
               movie.should.have.property('imdb_id', '123');
             }).should.be.fulfilled()
    });
  });

  describe('#toJSON()', function () {
    it('should have the correct format', function () {
      var url  = 'http://www.imdb.com/user/ur34552897/watchlist',
          imdb = new Imdb({url:  url});

      imdb.toJSON().should.have.property('class_name', 'Imdb');      
      imdb.toJSON().should.have.property('id', 'ImdbWatchlist(http://www.imdb.com/user/ur34552897/watchlist)');
      imdb.toJSON().should.have.property('url', 'http://www.imdb.com/user/ur34552897/watchlist');
    });
  });
});