var Omdb = require('./omdb'),
    omdb = new Omdb();

module.exports = {
  test: omdb.test.bind(omdb),
  search: omdb.search.bind(omdb),
  enrich: omdb.enrich.bind(omdb)
};