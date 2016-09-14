'use strict';

// import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, 
  browserHistory, IndexRedirect } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// import _ from 'lodash';
// import moment from 'moment';
// import request from 'superagent';

import Layout from './components/Layout';
import TabbedContent from './components/TabbedContent';
import NewHabit from './pages/NewHabit';


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
        <IndexRedirect to='/habits' />
        <Route path='/habits/new' component={NewHabit} />
        <Route path='/:q' component={TabbedContent} />
      </Route>
    </Router>
  </MuiThemeProvider>
  ), app);
