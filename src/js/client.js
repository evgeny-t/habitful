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

import 'whatwg-fetch';

import _ from 'lodash';
import moment from 'moment';
// import request from 'superagent';

import Layout from './components/Layout';
import Debug from './components/Debug';
import TabbedContent from './components/TabbedContent';
import NewHabit from './pages/NewHabit';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import reducer from './reducers';
import {
  addHabit,
  removeHabit,
  updateDate,
  markRoutineDone,
  refreshTodos,
  refreshLifetime,
  signInGoogle,
  initGoogleAuth,
} from './actions';

const muiTheme = getMuiTheme({ });

const logger = createLogger();

// TODO(ET): move dummy data outside (10)
const store = createStore(reducer, {
  birthday: moment('19900821', 'YYYYMMDD'),
  today: moment('20160906', 'YYYYMMDD'),
  habits: [
    {
      _id: 'bf792bf1-6031-439d-b492-08b5a8472e49',
      routine: 'monday routine',
      goal: 'test TODAY view',
      days: [false, true, false, false, false, false, false],
      history: [
        {
          when: moment('20130901', 'YYYYMMDD'),
        },
        {
          when: moment('20130801', 'YYYYMMDD'),
        },
      ],
    },
    {
      _id: '65b0a34c-9153-421f-9820-8b38fd2767cd',
      routine: 'tuesday routine',
      goal: 'test TODAY view',
      days: [false, false, true, false, false, false, false],
      history: [
      ],
    },
    {
      _id: '6c13bac2-45cb-47f6-85bd-1078c59cd2c1',
      routine: 'wednesday routine',
      goal: 'test TODAY view',
      days: [false, false, false, true, false, false, false],
      history: [
      ],
    },
    {
      _id: 'eedd6da7-bd65-4d32-92e9-d5cdf9919e87',
      routine: 'thursday routine',
      goal: 'test TODAY view',
      days: [false, false, false, false, true, false, false],
      history: [
      ],
    },
    {
      _id: 'c769a825-06f4-4b6b-a131-3b39611c3e10',
      routine: 'friday routine',
      goal: 'test TODAY view',
      days: [false, false, false, false, false, true, false],
      history: [
      ],
    },
    {
      _id: '699b68d4-0bee-453f-b913-8a9b3344d604',
      routine: 'Running',
      goal: 'it will help me to be more healty',
      days: [false, true, true, true, true, true, true],
      history: [
      ],
    },

    {
      _id: '15a9d418-7b94-4da9-a197-c89799e6943e',
      routine: 'Writing Writing Writing Writing Writing Writing Writing Writing',
      goal: 'it will help me to obtain the voice ;)',
      days: [false, true, true, true, true, true, true],
      history: [
      ],
    },

    {
      _id: '061c28bf-28b5-4d9e-bd43-b42f3ede7038',
      routine: 'Push-ups',
      goal: 'it will help me to be more muscled',
      days: [false, true, true, true, true, true, true],
      history: [
        {
          when: moment('19900902', 'YYYYMMDD'),
        },
        ...(_.range(1, 10).map(i => {
          return {
            when: moment().set({ year: 2015, month: 7, date: i }),
          };
        })),
      ],
    },
  ],

  lifetime: {
    modified: 0,
  },
}, applyMiddleware(ReduxThunk, logger));

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

const TabbedContentVisual = connect(
  // state to props
  state => state,
  // dispatch to props
  (dispatch) => {
    return {
      onMarkRoutineDone: (event, habit) => {
        dispatch(markRoutineDone(habit._id));
      },

      onTabChanged: (tab) => {
        browserHistory.push(`${tab}`);
      },

      onNewHabit: () => {
        browserHistory.push('/habits/new');
      },

      onHabitRemove: (habitId) => {
        dispatch(removeHabit(habitId));
      }
    };
  })(TabbedContent);

const VisualLayout = connect(
  // state to props
  state => state,
  // dispatch to props
  dispatch => {
    return {
      onSignInClick: () => {
        dispatch(signInGoogle());
      },
    };
  })(Layout);

const app = document.getElementById('app');
ReactDOM.render((
  <StyleRoot style={{ height: '100%' }}>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
          <Route path='/' component={VisualLayout}>
            <IndexRedirect to='/myhabits' />
            <Route path='/debug/:component' component={Debug} />
            <Route path='/habits/new' component={NewHabitVisual} />
            <Route path='/:q' component={TabbedContentVisual} />
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
