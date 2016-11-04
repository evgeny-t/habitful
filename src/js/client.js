'use strict';

// import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route,
  browserHistory, IndexRedirect } from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { StyleRoot, Style } from 'radium';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
  updateDate,
  markRoutineDone,
  refreshTodos,
} from './actions';

const muiTheme = getMuiTheme({ });

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
          when: moment('20160901', 'YYYYMMDD'),
        },
        {
          when: moment('20160801', 'YYYYMMDD'),
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
          when: moment('19900802', 'YYYYMMDD'),
        },
        ...(_.range(1, 10).map(i => {
          return {
            when: moment().set({ year: 2016, month: 7, date: i }),
          };
        })),
      ],
    },
  ],
});

// setInterval(() => {
//   store.dispatch(updateDate(store.getState().today.clone().add(1, 'days')));
// }, 1000);

store.dispatch(refreshTodos());

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
    };
  })(TabbedContent);

const app = document.getElementById('app');
ReactDOM.render((
  <StyleRoot>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
          <Route path='/' component={Layout}>
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
        body: {
          fontFamily: muiTheme.fontFamily
        },
        p: {
          margin: 0
        }
        // TODO(ET): media queries
      }}
    />
  </StyleRoot>
  ), app);
