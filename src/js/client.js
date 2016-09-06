'use strict';

// import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, 
  browserHistory, IndexRoute } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// import _ from 'lodash';
// import moment from 'moment';
// import request from 'superagent';

import Layout from './components/Layout';
import A from './pages/A';


import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({ });

const app = document.getElementById('app');
ReactDOM.render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={browserHistory}>
      <Route path='/' component={Layout}>
        <IndexRoute component={A} />
      </Route>
    </Router>
  </MuiThemeProvider>
  ), app);
