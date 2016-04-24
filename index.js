'use strict';

var backend           = require('./backend'),
    webserver         = backend.webserver,
    logger            = backend.logger.getLogger('Main'),
    models            = backend.models,
    path              = require('path');

models.initialize()
      .then(webserver.start())
      .catch((e) => {
        logger.error('caught error', e.message);
      });