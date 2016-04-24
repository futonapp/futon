'use strict';

var React                   = require('react'),
    LibraryView             = require('./library.jsx'),
    classNames              = require('classnames'),
    SettingsView            = require('./settings.jsx'),
    Link                    = require('react-router').Link,
    ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Application extends React.Component {
  handleTest(){

  }

  render() {
    var pathname   = this.props.location.pathname,
        isSettings = pathname === '/settings';

    return(
      <div>
        <header>
          <div className="logo"><span>stage</span>hand</div>
          
          <nav>
            <Link to={isSettings ? '/' : '/settings'}>
              <div className={classNames("button", {
                'settings': !isSettings,
                'home':     isSettings
              })}><span></span></div>
            </Link>
          </nav>
        </header>
        <ReactCSSTransitionGroup
          component="div"
          transitionName="page-transition"
          transitionEnterTimeout={50}
          transitionLeaveTimeout={50}
        >
          {React.cloneElement(this.props.children, {
            key: this.props.location.pathname
          })}
        </ReactCSSTransitionGroup>
        <footer>
          <div className="status">Backend Status: Dunno</div>
        </footer>
      </div>
    );
      
  }
}

module.exports = Application;