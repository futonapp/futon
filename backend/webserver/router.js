'use strict';

var express = require('express'),
    router  = express.Router(),
    models  = require('../models'),
    Movie   = models.Movie;

var index = function(req, res, next) {
  Movie.findAll()
    .then((movies) => {
      res.render('index', {
        movies: JSON.stringify(movies.map( (m) => m.toJSON()))
      });
    });
}

router.get('/',          index);
router.get('/settings',  index);
router.get('/movie/:id', index);

router.get('/api/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id)
       .then((movie) => {
         if (!movie){
           res.json({movie: null});
           return;
         }
         movie.getTorrents()
              .then((torrents) => {
                movie = movie.toJSON({size: 'large'});
                movie.torrents = torrents.map(t => t.toJSON())
                res.json({
                  movie: movie
                });       
              })
       });
});

// function test(){
//   logger.info('testing movie aggregator...');
//   movieAggregator.test((e) => {
//     if (e){
//       logger.error('movie aggregator test failed');
//     }
//     else {
//       logger.info('movie aggregator test passed');
//     }
//   });

//   logger.info('testing torrent aggregator...');
//   torrentAggregator.test((e) => {
//     if (e){
//       logger.error('torrent aggregator test failed');
//     }
//     else {
//       logger.info('torrent aggregator test passed');
//     }
//   });
// }

module.exports = router;