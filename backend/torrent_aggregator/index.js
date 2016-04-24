'use strict';

var Kickass = require('./kickass'),
    kickass = new Kickass();

module.exports = {
  test: kickass.test.bind(kickass),
  search: kickass.search.bind(kickass)
};