var watchlist   = require('../../backend/watchlist');
var Imdb   = require('../../backend/watchlist/imdb');

describe('watchlist', function() {
  beforeEach(function() {
    this.config = [{
      type: 'imdb',
      url:  'http://www.imdb.com/user/ur34552897/watchlist'
    }];
    watchlist.setConfig(this.config);
  });

  describe('#getConfig()', function () {
    it('should return the correct configuration', function () {
      watchlist.getConfig().should.equal(this.config);
      watchlist.providers[0].should.be.an.instanceOf(Imdb);
      watchlist.providers[0].url.should.equal('http://www.imdb.com/user/ur34552897/watchlist');
    });
  });

  describe('#toJSON()', function () {
    it('should have the correct format', function () {
      watchlist.toJSON().should.have.property('providers', [watchlist.providers[0].toJSON()])
    });
  });

  describe('#downloadBacklog()', function () {
    it('should download the backlog from all providers', function () {
      watchlist.providers = [
        new Imdb({url: 'http://www.imdb.com/user/ur34552897/watchlist?title_type=movie'}),
        new Imdb({url: 'http://www.imdb.com/user/ur34343897/watchlist'})
      ];
      pending
      // downloadBacklog(lastCheckedAt, iterator){
      //   return new Promise((fulfill, reject) => {});
      // };

    });
  });

});