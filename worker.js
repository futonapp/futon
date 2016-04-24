'use strict';

var backend        = require('./backend'),
    models         = backend.models,
    worker         = backend.worker,
    logger         = backend.logger.getLogger('Main');

models.initialize()
      .then(worker.start)
      .catch((e) => {
        logger.error('caught error', e.message);
      });