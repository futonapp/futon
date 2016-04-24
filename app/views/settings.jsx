'use strict';

var React   = require('react');

class SettingsView extends React.Component {  
  render(){  
    return(
      <div id="window">
        <div id="titlebar">
          <h1>Settings</h1>
        </div>
        <div id="content" ref="content">
          <h1>Blah</h1>
        </div>
      </div>
    );
  }
}

module.exports = SettingsView;