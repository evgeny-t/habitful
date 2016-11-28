'use strict';

// import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route,
  browserHistory, IndexRedirect } from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { StyleRoot, Style } from 'radium';
import createLogger from 'redux-logger';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import moment from 'moment';
import 'whatwg-fetch';

import Layout from './components/Layout';
import Debug from './components/Debug';
import NewHabit from './pages/NewHabit';

import Today from './pages/Today';
import Overview from './pages/Overview';
import MyHabits from './pages/MyHabits';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import reducer from './reducers';
import {
  addHabit,
  removeHabit,
  // updateDate,
  markRoutineDone,
  refreshTodos,
  refreshLifetime,
  signInGoogle,
  initGoogleAuth,
} from './actions';

const muiTheme = getMuiTheme({ });

const logger = createLogger();

let dummy;

try {
  dummy = require('../../dummy.js').default;
} catch(e) {
  dummy = {
    firstTime: true,
    birthday: moment(),
    today: moment(),
    habits: [
    ],
    lifetime: {
      modified: 0,
    },
  };
}

const store = createStore(reducer, dummy, applyMiddleware(ReduxThunk, logger));

// setInterval(() => {
//   store.dispatch(updateDate(store.getState().today.clone().add(1, 'days')));
// }, 1000);

store.dispatch(initGoogleAuth());
store.dispatch(refreshTodos());
store.dispatch(refreshLifetime());

const NewHabitVisual = connect(
  // state to props
  state => {
    return { defaultStartDate: state.today };
  },
  // dipatch to props
  dispatch => {
    return {
      onDone: (habit) => {
        browserHistory.push('/myhabits');
        dispatch(addHabit(habit));
      }
    };
  })(NewHabit);

// const TabbedContentVisual = connect(
//   // state to props
//   state => state,
//   // dispatch to props
//   (dispatch) => {
//     return {
//       onMarkRoutineDone: (event, habit) => {
//         dispatch(markRoutineDone(habit._id));
//       },

//       onTabChanged: (tab) => {
//         browserHistory.push(`${tab}`);
//       },

//       onNewHabit: () => {
//         browserHistory.push('/habits/new');
//       },

//       onHabitRemove: (habitId) => {
//         dispatch(removeHabit(habitId));
//       }
//     };
//   })(TabbedContent);

const MyHabitsVisual = connect(
  state => state,
  dispatch => {
    return {
      onNewHabit: () => {
        browserHistory.push('/habits/new');
      },

      onHabitRemove: (habitId) => {
        dispatch(removeHabit(habitId));
      }
    };
  })(MyHabits);

const OverviewVisual = connect(
  state => state,
  () => {
    return {};
  })(Overview);

const TodayVisual = connect(
  state => state,
  dispatch => {
    return {
      onCheck: (event, habit) => {
        dispatch(markRoutineDone(habit._id));
      },
    };
  })(Today);

const LayoutVisual = connect(
  // state to props
  state => state,
  // dispatch to props
  dispatch => {
    return {
      onSignInClick: () => {
        dispatch(signInGoogle());
      },
      onNavigate: (route) => {
        browserHistory.push(`${route}`);
      }
    };
  })(Layout);

const app = document.getElementById('app');
ReactDOM.render((
  <StyleRoot style={{ height: '100%' }}>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
          <Route path='/' component={LayoutVisual}>
            <IndexRedirect to='/myhabits' />
            <Route path='/debug/:component' component={Debug} />
            <Route path='/habits/new' component={NewHabitVisual} />
            <Route path='/myhabits' component={MyHabitsVisual} />
            <Route path='/today' component={TodayVisual} />
            <Route path='/overview' component={OverviewVisual} />

          </Route>
        </Router>
      </MuiThemeProvider>
    </Provider>
    <Style
      rules={{
        html: {
          height: '100%',
        },
        body: {
          fontFamily: muiTheme.fontFamily,
          height: '100%',
        },
        '#app': {
          height: '100%',
        },
        p: {
          margin: 0
        }
        // TODO(ET): media queries
      }}
    />
  </StyleRoot>
  ), app);
