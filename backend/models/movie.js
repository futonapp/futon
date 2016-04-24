'use strict';

var database          = require('./database'),
    movieAggregator   = require('../movie_aggregator'),
    torrentAggregator = require('../torrent_aggregator'),
    Sequelize         = require('sequelize'),
    Torrent           = require('./torrent'),
    logger            = require('../logger').getLogger('Movie'),
    _                 = require('lodash');

var Movie = database.define('movie', {
  title:        { type: Sequelize.STRING },
  year:         { type: Sequelize.INTEGER },
  release_date: { type: Sequelize.DATE },
  genre:        { type: Sequelize.STRING },
  director:     { type: Sequelize.STRING },
  writer:       { type: Sequelize.STRING },
  actors:       { type: Sequelize.STRING },
  plot:         { type: Sequelize.TEXT },
  language:     { type: Sequelize.STRING },
  country:      { type: Sequelize.STRING },
  awards:       { type: Sequelize.STRING },
  poster_url:   { type: Sequelize.STRING },
  imdb_rating:  { type: Sequelize.FLOAT },
  imdb_votes:   { type: Sequelize.INTEGER },
  imdb_id:      { type: Sequelize.STRING },
  state:        { type: Sequelize.STRING }
}, {
  underscored: true,
  instanceMethods: {
    toJSON: function(options) { 
      options = options || {};  
      var base = {
        id:           this.id,
        title:        this.title,
        year:         this.year,
        genre:        this.genre,
        poster_url:   this.poster_url,
        imdb_rating:  this.imdb_rating,
        imdb_id:      this.imdb_id,
        state:        this.state,
        updated_at:   this.updated_at,
        plot:         this.plot
      };

      if (options.size === 'large'){
        _.assign(base, {
          release_date: this.release_date,
          director:     this.director,
          writer:       this.writer,
          actors:       this.actors,
          plot:         this.plot,
          language:     this.language,
          country:      this.country,
          awards:       this.awards,
          imdb_votes:   this.imdb_votes
        })
      }
      return base;
    },

    enrich: function(){  
      logger.info('enriching movie id=', this.id);
      return new Promise((fulfill, reject) => {
        var movieAttribs = {
          imdb_id: this.imdb_id
        };
        movieAggregator.enrich(movieAttribs, (e, movie) => {
          if (e){
            reject(e);
            return;
          }

          fulfill(this.update({
            release_date: movie.release_date,
            genre:        movie.genre,
            director:     movie.director,
            writer:       movie.writer,
            actors:       movie.actors,
            plot:         movie.plot,
            language:     movie.language,
            country:      movie.country,
            awards:       movie.awards,
            poster_url:   movie.poster_url,
            imdb_rating:  movie.imdb_rating,
            imdb_votes:   movie.imdb_votes,
            state:        'pending'
          }));
        });
      });
    },
    fetchTorrents: function(){
      return new Promise((fulfill, reject) => {
        torrentAggregator.search(`imdb:${this.imdb_id.replace('tt', '')}`, (e, torrents) => {
          console.log(torrents.length);
          if (e){
            reject(e);
            return;
          }
          fulfill(
            Torrent.destroy({ where: { movie_id: this.id } })
                   .then(_ => {
                     if (torrents.length > 0) this.update({state: 'available'});
                   })
                   .then(_ => {
                     torrents.forEach((t) => {t.movie_id = this.id});
                     return Torrent.bulkCreate(torrents);
                   })
          )
        });
      });
    }
  },
  classMethods: {
    processWatchlistMovie: function(movieAttribs){
      return this.findOrCreate({
        where: {
          imdb_id: movieAttribs.imdb_id
        }, 
        defaults: {
          title:   movieAttribs.title,
          year:    (!!movieAttribs.year ? +movieAttribs.year : null),
          imdb_id: movieAttribs.imdb_id,
          state:   'new'
        }})
        .spread((movie, meta) => {
          logger.trace('processed', movieAttribs.title, 'from watchlist');
          return movie;
        })
    }
  }
});

module.exports = Movie;