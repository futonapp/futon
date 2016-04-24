'use strict';

var kue               = require('kue'),
    backend           = require('./backend'),
    models            = backend.models,
    watchlist         = backend.watchlist,
    logger            = backend.logger.getLogger('Worker'),
    jobs              = kue.createQueue();

function startWorkers(){
  logger.info('starting fetch torrent worker..');
  jobs.process('fetch torrents', 1, (job, done) => {
    var movieAttribs = job.data.movie;
    models.Movie.findById(movieAttribs.id)
                .then((movie) => {
                  movie.fetchTorrents()
                       .then( _ => { done() })
                       .catch(e => { done(e) })
                })
                .catch((e) => {
                  logger.error('error while fetching torrents for', movieAttribs.title, ':', e);
                  done(e);
                });
  });

  logger.info('starting imdb watchlist worker..');
  jobs.process('imdb watchlist movie', 1, (job, done) => {
    var movieAttribs = job.data.movie;
    models.Movie.processWatchlistMovie(movieAttribs)
                .then((movie) => {
                  if (movie.state !== 'new'){ done(); return; }
                  jobs.create('enrich movie', {
                    title: movie.title,
                    movie: { id: movie.id }
                  }).save(done);
                })
                .catch((e) => {
                  logger.error('error while processing', movieAttribs.title, ':', e);
                  done(e);
                });
  });

  logger.info('starting enrich movie worker..');
  jobs.process('enrich movie', 1, (job, done) => {
    models.Movie.findById(job.data.movie.id)
                .then((m) => { return m.enrich(); })
                .then( _  => { done(); })
                .catch((e) => {
                  logger.error('error enriching movie', e);
                  done(e);
                })
  });
}

function downloadBacklog(){
  watchlist.downloadBacklog((m) => {
             jobs.create('imdb watchlist movie', {
               title: m.title, 
               movie: m
             }).save();
           })
           .then(  _  => { logger.info('backlogStream done'); })
           .catch((e) => { logger.error('error downloading backlog', e); });
}

function downloadAllTorrents(){
  models.Movie.findAll()
        .then((movies) => {
          movies.forEach((movie) => {
            jobs.create('fetch torrents', {
              title: movie.title, 
              movie: {id: movie.id}
            }).save();
          });
        })
}

models.initialize()
      .then(_ => {
        // downloadAllTorrents();
        downloadBacklog();
        startWorkers();
      });


