'use strict';

var React       = require('react'),
    ReactDOM    = require('react-dom'),
    Events      = require('minivents'),
    views       = require('./views'),
    Library     = require('./views/library.jsx'),
    Settings    = require('./views/settings.jsx'),
    Movie       = require('./views/movie.jsx');

import { 
  browserHistory, 
  Router, 
  Route, 
  IndexRoute, 
  Link } from 'react-router'

(function () {
  function render(){
    ReactDOM.render((
      <Router history={browserHistory}>
        <Route path="/" component={views.Application}>
          <IndexRoute component={Library}/>
          <Route path="settings" component={Settings} />
          <Route path="movie/:movieId" component={Movie} />
        </Route>
      </Router>
    ), document.getElementById('container'))
  }
  render();
})();

