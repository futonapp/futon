'use strict';

var React    = require('react'),
    Griddle  = require('griddle-react'),
    moment   = require('moment'),
    database = require('../database'),
    Link     = require('react-router').Link;

class Row extends React.Component {
  render() {
    return <div style={{height: '100px', position: 'absolur'}}>{JSON.stringify(this.props.data)}</div>;
  }
}

class LibraryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridHeight: 500,
    };
  }

  componentDidMount() {
    this.setState({gridHeight: this.refs.content.clientHeight})    
  }

  handleFilterInputChange(event){
    var filterString = event.target.value.trim();

    ((filterString) => {
      setTimeout(_ => {
        this.refs.Griddle.setFilter(filterString);
      }, 0);
    })(filterString);
  }

  render() {
    var columnMetaData = [
      {
        "columnName": "title",
        "displayName": "Title",
        'customComponent': React.createClass({
          componentDidMount: function() {
            // console.log(this.refs.poster);
          },

          render: function(){
            var movie = this.props.rowData;
            return <div className="movie-row">
                      <Link to={`/movie/${movie.id}`}>
                        <div className="poster small" ref="poster" style={{backgroundImage: `url(${movie.poster_url})`}}/>
                        <div className="block">
                          <h1>{movie.title}<span className="year">{movie.year}</span></h1>
                          <div className="plot">{movie.plot}</div>
                          <div className="state"><span>State </span>{movie.state}</div>
                        </div>
                      </Link>
                    </div>;
          }
        })
      }
    ];
    
    return(
      <div id="window">
        <div id="titlebar">
          <h1>Library</h1>
          <div className="filter">
            <input type="text" 
                   onChange={this.handleFilterInputChange.bind(this)}
                   placeholder="Filter"/>
          </div>
        </div>
        <div id="content" ref="content">
          <Griddle results={database.movies.toJSON()}
                   ref='Griddle'
                   columnMetadata={columnMetaData} 
                   columns={columnMetaData.map((m) => { return m.columnName })}
                   resultsPerPage={30} 
                   enableInfiniteScroll={true} 
                   showTableHeading={false}
                   bodyHeight={this.state.gridHeight}
                   useGriddleStyles={false}
                   />
        </div>
      </div>
    );
      
  }
}

module.exports = LibraryView;