var request  = require('superagent'),
    Immutable = require('immutable');

class Database {
  constructor(data) {
    this.movieList = Immutable.fromJS(data.movies); 
  }

  get movies() {
    return this.movieList;
  }

  findMovieById(id) {
    return this.movieList.find(m => m.get('id') === +id);
  }

  getDetailedMovie(id) {
    return new Promise((fulfill, reject) => {
      request
        .get(`/api/movies/${id}`)
        .end((e, res) => {
          if (e){
            reject(e);
          }
          else {
            if (res.body.movie){
              fulfill(new Immutable.Map(res.body.movie));
            }
            else {
              fulfill(null);
            }
          }          
        });
    });
  }
}

module.exports = new Database({
  movies: window.movies
});