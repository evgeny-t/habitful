'use strict';

import _ from 'lodash';

export function addHabit(state, { habit }) {
  const newState = Object.assign({}, state, {
    habits: [...state.habits, {
      history: [],
      in: null,
      days: [false, false, false, false, false, false, false],
      ...habit
    }]
  });

  return refreshTodos(newState);
}

export function removeHabit(state, { habitId, now }) {
  return {
    ...state,
    habits: _.map(state.habits, h =>
      h._id === habitId ? {...h, deletedAt: now } : h),
  };
}

export function updateHabit(state, { habit }) {
  return {
    ...state,
    habits: _.map(state.habits, h => {
      if (h._id && habit._id && h._id === habit._id) {
        return {
          ...h,
          ...habit,
        };
      } else {
        return h;
      }
    }),
  };
}

export function updateDate(state, { date }) {
  return refreshTodos({ ...state, today: date });
}

export function markRoutineDone(state, { habitId/*, now*/ }) {
  state = _.cloneDeep(state);

  const needsToBeUpdated =
    _.findIndex(state.habits, h => h._id === habitId);
  state.habits[needsToBeUpdated].history.push({
    when: state.today,
  });
  state.habits[needsToBeUpdated].history.sort();
  return refreshLifetime(refreshTodos(state));
}

export function refreshTodos(state) {
  return Object.assign({}, state, {
    habits: state.habits.map(habit => {
      const today = habit.startsFrom ?
        (habit.startsFrom > state.today ? habit.startsFrom : state.today) :
        state.today;
      habit = _.cloneDeep(habit);
      habit.in = null;
      let history = habit.history || [];
      history.sort((a, b) => a.when > b.when);
      const lastTime = history.length ? _.last(history).when : null;

      if (!_.some(habit.days)) {
        return habit;
      }

      let nextDoW = today.day() + (today.diff(lastTime, 'days') === 0 ? 1 : 0);
      while (!habit.days[nextDoW] && nextDoW < habit.days.length) {
        nextDoW++;
      }

      if (nextDoW >= habit.days.length) {
        nextDoW = 0;
        while (!habit.days[nextDoW] && nextDoW < habit.days.length) {
          nextDoW++;
        }
      }

      if (nextDoW >= habit.days.length) {
        // next time will be never
      } else {
        let daySpan = nextDoW - today.day();
        if (today.isSame(lastTime) && daySpan === 0) {
          daySpan = 7;
        }

        habit.in = daySpan >= 0 ? daySpan : (7 + daySpan);
        habit.in -= state.today.diff(today, 'days');
      }

      return habit;
    })
  });
}

export function refreshLifetime(state) {
  state = { lifetime: {}, ...state };
  const lifetime = _.map(state.habits, 'history')
    .reduce((prev, current) => prev.concat(_.map(current, 'when')), [])
    .map(h => h.diff(state.birthday, 'weeks'))
    .reduce((prev, current) => {
      prev[current] = prev[current] === undefined ? 1 : prev[current] + 1;
      return prev;
    }, { modified: (state.lifetime.modified || 0) + 1 });
  return { ...state, lifetime };
}

export function setUser(state, { user }) {
  return { ...state, user };
}

// export function filterLibraryItems(state, action) {
//   return {
//     ...state,
//     filter: action.filter,
//   };
// }

export function updateTitle(state, action) {
  return {
    ...state,
    title: action.title,
  };
}

export function increaseHabitPopularity(state, action) {
  state = _.cloneDeep(state);
  const popularity = state.library.popularity[action.libraryHabitId] || 0;
  state.library.popularity[action.libraryHabitId] = popularity + 1;
  return state;
}

export function addHabitFromLibrary(state, action) {
  if (_.find(state.habits, item =>
    item.parentId === action.libraryHabitId)) {
    throw new Error('habit already had been added');
  }

  state = _.cloneDeep(state);
  const item = _.find(state.library.items,
    item => item._id === action.libraryHabitId);

  state.habits = (state.habits || []).concat({
    _id: action.newHabitId,
    routine: item.name,
    goal: item.description,
    days: [true, true, true, true, true, true, true],
    tags: item.tags,
    history: [
    ],
    parentId: action.libraryHabitId,
  });

  return state;
}

export function init(state, action) {
  // eslint-disable-next-line no-unused-vars
  const { type, ...slice } = action;
  return {
    ...state,
    ...slice,
  };
}

export function uploadToDriveStart(state) {
  return {
    ...state,
    uploadToDriveInProgress: true,
  };
}

export function uploadToDriveSucceeded(state) {
  return {
    ...state,
    uploadToDriveInProgress: false,
  };
}

export function fetchFromDriveStart(state) {
  return {
    ...state,
    fetchFromDriveInProgress: true,
  };
}

export function fetchFromDriveSucceeded(state) {
  return {
    ...state,
    fetchFromDriveInProgress: false,
    loaded: true,
  };
}

export function fetchFromDriveFailed(state, action) {
  // eslint-disable-next-line no-unused-vars
  const { type, ...error } = action;
  return {
    ...state,
    fetchFromDriveInProgress: false,
    fetchFromDriveError: error,
    loaded: true,
  };
}

export function openDrawer(state) {
  return {
    ...state,
    openDrawer: true,
  };
}

export function completeTour(state) {
  return {
    ...state,
    firstTime: false,
  };
}

export function showSetupDialog(state) {
  return {
    ...state,
    showSetupDialog: true,
  };
}

export function setBirthday(state, action) {
  return {
    ...state,
    birthday: action.birthday,
  };
}


export default (state, action) => {
  const actionMethod = _.camelCase(action.type);
  if (module.exports[actionMethod]) {
    return module.exports[actionMethod](state, action);
  } else {
    return state;
  }
};
