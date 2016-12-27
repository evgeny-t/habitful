'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider, connect } from 'react-redux';
import { StyleRoot, Style } from 'radium';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import _ from 'lodash';
import moment from 'moment';
import 'whatwg-fetch';

import TagsEditor from './components/TagsEditor';
import Layout from './components/Layout';
import NewHabit from './pages/NewHabit';

import Today from './pages/Today';
import Overview from './pages/Overview';
import MyHabits from './pages/MyHabits';
import Library from './pages/Library';

import { observer, observe } from 'redux-observers';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import createTour from './tour';
import createStore from './store';
import * as actions from './actions';

import * as colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme({
  spacing: {
    desktopKeylineIncrement: 52,
  },
  palette: {
    primary1Color: colors.blue500,
    primary2Color: colors.blue700,
    primary3Color: colors.grey400,
    accent1Color: colors.deepOrangeA200,
    accent2Color: colors.deepOrange100,
    accent3Color: colors.deepOrange500,
    textColor: colors.darkBlack,
    alternateTextColor: colors.white,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    disabledColor: fade(colors.darkBlack, 0.3),
    pickerHeaderColor: colors.cyan500,
    clockCircleColor: fade(colors.darkBlack, 0.07),
    shadowColor: colors.fullBlack,
  },
});

let dummy;

try {
  dummy = require('../../dummy.js').default;
} catch(e) {
  dummy = {
    loaded: false,
    openDrawer: false,
    firstTime: true,
    birthday: moment(),
    today: moment(),
    habits: [
    ],
    lifetime: {
      modified: 0,
    },
    library: {
      items: [],
    },
  };
}

const store = createStore(dummy);

// setInterval(() => {
//   store.dispatch(updateDate(store.getState().today.clone().add(1, 'days')));
// }, 1000);

store.dispatch(actions.updateTitle('Habitful'));
store.dispatch(actions.initGoogleAuth());
store.dispatch(actions.refreshTodos());
store.dispatch(actions.refreshLifetime());

import '../../node_modules/tether-shepherd/dist/css/shepherd-theme-arrows.css';

const throttledUploadToDrive = _.throttle(() => {
  store.dispatch(actions.uploadToDrive());
}, 500, { leading: false });

const observerOptions = {
  // equals: _.isEqual
};

const loadedObserver = observer(
  state => state.loaded,
  (dispatch, current) => {
    if (current && store.getState().firstTime) {
      const tour = createTour(store, actions);
      tour.start();
    }
  });

// TODO(ET): stop copy-pasting here
const syncHabitsWithDriveObserver = observer(
  state => state.habits,
  () => {
    if (!store.getState().fetchFromDriveInProgress) {
      throttledUploadToDrive();
    }
  }/*, observerOptions*/);
const syncBirthdayWithDriveObserver = observer(
  state => state.birthday,
  () => {
    if (!store.getState().fetchFromDriveInProgress) {
      throttledUploadToDrive();
    }
  }/*, observerOptions*/);

const syncFirstTimeWithDriveObserver = observer(
  state => state.firstTime,
  () => {
    if (!store.getState().fetchFromDriveInProgress) {
      throttledUploadToDrive();
    }
  }/*, observerOptions*/);

observe(store, [
  loadedObserver,
  syncHabitsWithDriveObserver,
  syncBirthdayWithDriveObserver,
  syncFirstTimeWithDriveObserver,
]);

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
        dispatch(actions.addHabit(habit));
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

const onNavigate = {
  onNavigate: (route) => {
    browserHistory.push(`${route}`);
  },
};

const MyHabitsVisual = connect(
  state => state,
  dispatch => {
    return {
      onNewHabit: () => {
        browserHistory.push('/habits/new');
      },

      onHabitRemove: (habitId) => {
        dispatch(actions.removeHabit(habitId));
      },

      onTagClick: (tag) => {
        browserHistory.push(`/myhabits/${tag}`);
      },

      ...onNavigate,
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
        dispatch(actions.markRoutineDone(habit._id));
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
        dispatch(actions.signInGoogle());
      },
      onSignOutClick: () => {
        dispatch(actions.signOut());
      },

      ...onNavigate,
    };
  })(Layout);

const LibraryVisual = connect(
  state => {
    return { library: state.library };
  },
  dispatch => {
    return {
      onLibraryTagClick: tag => {
        browserHistory.push(`/library/${tag}`);
      },
      onFilter: tag => {
        dispatch(actions.updateTitle(`${tag}`));
      },
      onAddClick: libraryHabitId => {
        dispatch(actions.importHabit(libraryHabitId));
      },
    };
  })(Library);

function setTitleOnEnter(title) {
  return () => store.dispatch(actions.updateTitle(title));
}

const routes = {
  path: '/',
  component: LayoutVisual,
  indexRoute: { onEnter: (nextState, replace) => replace('/myhabits') },
  childRoutes: [
    {
      path: 'habits/new',
      component: NewHabitVisual,
      onEnter: setTitleOnEnter('New Habit'),
    },
    {
      path: '/myhabits(/:filter)',
      component: MyHabitsVisual,
      onEnter: (nextState/*, replace*/) =>
        store.dispatch(actions.updateTitle(
          nextState.params.filter || 'My Habits')),
    },
    {
      path: '/today',
      component: TodayVisual,
      onEnter: setTitleOnEnter('Today'),
    },
    {
      path: '/overview',
      component: OverviewVisual,
      onEnter: setTitleOnEnter('Overview'),
    },
    {
      path: '/library(/:filter)',
      component: LibraryVisual,
      onEnter: (nextState/*, replace*/) =>
        store.dispatch(actions.updateTitle(
          nextState.params.filter || 'Library')),
    },
    // {
    //   path: '/tageditor',
    //   component: () => (<TagsEditor
    //     allTags={['foo', 'bar', 'baz', 'foo bar']}
    //     tags={['baz']}
    //     />),
    // }
  ]
};

const app = document.getElementById('app');
ReactDOM.render((
  <StyleRoot style={{ height: '100%' }}>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory} routes={routes} />
      </MuiThemeProvider>
    </Provider>
    <Style
      rules={{
        html: {
          height: `calc(100% - ${muiTheme.appBar.height}px)`,
        },
        body: {
          fontFamily: muiTheme.fontFamily,
          height: '100%',
          margin: 0,
        },
        'a:hover': {
          textDecoration: 'underline',
        },
        a: {
          textDecoration: 'none',
          color: '#4078c0',
          cursor: 'pointer',
        },
        '#app': {
          height: '100%',
        },
        p: {
          margin: 0
        }
        // TODO(ET): media queries: Make sure app looks good with common resolutions
      }}
    />
  </StyleRoot>
  ), app);

