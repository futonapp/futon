'use strict';

var backend           = require('./backend'),
    webserver         = backend.webserver,
    logger            = backend.logger.getLogger('Main'),
    models            = backend.models,
    path              = require('path');

models.initialize()
      .then(webserver.start())
      // .then(_ => {
      //   models.Movie
      //         .findById(2)
      //         .then(movie => { 
      //           movie.getTorrents()
      //                .then((torrents) => {
      //                  torrents.forEach(torrent => {
      //                    torrent.parseTitle();
      //                  });
      //                });

      //         });
      // })
      .catch((e) => {
        logger.error('caught error', e.message);
      });