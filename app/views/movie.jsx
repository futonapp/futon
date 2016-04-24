'use strict';

var React    = require('react'),
    database = require('../database'),
    filesize = require('filesize'),
    Link     = require('react-router').Link;

class TorrentList extends React.Component {    
  render() {
    var movie = this.props.movie;
    if (movie.get('state') !== 'available'){
      return <span />;
    }
  
    console.log(movie.get('torrents'));    
    var list = movie.get('torrents').map(torrent => {
      return <tr>
               <td><a href={torrent.source_url} target="_blank">{torrent.title}</a></td>
               <td>{filesize(torrent.size)}</td>
               <td>{torrent.seeds}</td>
             </tr>;
    });

    return <table className="torrents">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Seeders</th>
              </tr>
              {list}
            </tbody>
          </table>;
  }
}

class MovieView extends React.Component {    

  constructor(props) {
    super(props);
    var movie = database.findMovieById(this.props.params.movieId);
    this.state = {
      movie:   movie,
      loading: true
    };
  }

  componentWillMount() {
    database.getDetailedMovie(this.props.params.movieId)
      .then(movie => {
        this.setState({
          loading: false,
          movie: movie
        });
      })
      .catch(e => {
        this.setState({
          loading: false,
          movie: null
        });
      });
  }

  render() {
    var movie = this.state.movie,
        title = '',
        content;

    if (this.state.loading){
      title   = movie && movie.get('title') ? movie.get('title') : 'Unknown Movie'; 
      content = 
        <div className="loading">Loading...</div>;
    }
    else if (movie) {
      title   = movie.get('title'); 
      content = 
        <div className="movie">
          <div className="poster large" style={{backgroundImage: `url(${movie.get('poster_url')})`}}/>
          <div className="block">
            <h1>{movie.get('title')}<span className="year">{movie.get('year')}</span></h1>
            <div className="actions">
              <a href={`http://www.imdb.com/title/${movie.get('imdb_id')}/`} target="_blank">IMDB Page</a>
              <div className="state">{movie.get('state')}</div>
            </div>
            <ul className="attributes">
              <li><b>Director</b>{movie.get('director')}</li>
              <li><b>Writer</b>{movie.get('writer')}</li>
              <li><b>Cast</b>{movie.get('actors')}</li>
              <li><b>Language</b>{movie.get('language')}</li>
              <li><b>Awards</b>{movie.get('awards')}</li>
              <li><b>IMDB Rating</b>{movie.get('imdb_rating')}</li>
              <li><b>IMDB Votes</b>{movie.get('imdb_votes')}</li>
            </ul>
            <div className="plot">{movie.get('plot')}</div>
          </div>
          <TorrentList movie={movie} />

        </div>;
    }
    else {
      title   = 'Unknown Movie'; 
      content = <div className="error">Could not retrieve movie data.</div>;
    }

    return(
      <div id="window">
        <div id="titlebar">
          <h1><Link to="/" className="back"></Link><span>{title}</span></h1>
        </div>
        <div id="content" ref="content">
          {content}
        </div>
      </div>
    );
  }
}

module.exports = MovieView;