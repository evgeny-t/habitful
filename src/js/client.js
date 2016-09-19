'use strict';

// import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, 
  browserHistory, IndexRedirect } from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

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

import reducer from './reducers';
import { addHabit } from './actions';

const muiTheme = getMuiTheme({ });

const store = createStore(reducer, {
  habits: [
    {
      routine: 'Running',
      goal: 'it will help me to be more healty',
      days: [true, true, true, true, true, true, true],
    },

    {
      routine: 'Writing Writing Writing Writing Writing Writing Writing Writing',
      goal: 'it will help me to obtain the voice ;)',
      days: [true, true, true, true, true, true, true],
    },

    {
      routine: 'Push-ups',
      goal: 'it will help me to be more muscled',
      days: [true, true, true, true, true, true, true],
    },
  ],
  history: [
  ]
});

const NewHabitVisual = connect(
  state => state, 
  dispatch => {
    return {
      onDone: (habit) => {
        browserHistory.push('/habits');
        dispatch(addHabit(habit));
      }
    };
  })(NewHabit);

const app = document.getElementById('app');
ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>
        <Route path='/' component={Layout}>
          <IndexRedirect to='/habits' />
          <Route path='/habits/new' component={NewHabitVisual} />
          <Route path='/:q' component={TabbedContent} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>
  ), app);
