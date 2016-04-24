'use strict';

var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    expressHBS  = require('express-handlebars'),
    bodyParser  = require('body-parser'),
    router      = require('./router'),
    app         = express(),
    logger      = require('../logger').getLogger('WebServer'),
    server      = http.createServer(app),
    kue         = require('kue');

app.engine('.hbs', expressHBS({
  defaultLayout: 'application', 
  extname:       '.hbs'
}));

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', '.hbs');

app.use(function(req, res, next){
  logger.info(`[${req.socket.remoteAddress}] ${req.method} ${req.headers.host} ${req.url}`);
  next();
});
 
app.use('/kue', kue.app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../build')));
app.use(router);

function start(){
  logger.info("starting webserver...");
  return new Promise(function(fulfill, reject) {
    server.listen(3000, function(e){
      if (e){
        reject(e);
      }
      else {
        logger.info('webserver listening on 3000');
        fulfill();
      }
    });
  });
}

module.exports = {
  start: start
}