var log4js = require('log4js'); 

module.exports.getLogger = function(name){
  return log4js.getLogger(name);
};