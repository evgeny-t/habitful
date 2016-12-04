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

      let nextDoW = today.day() + (today.isSame(lastTime) ? 1 : 0);
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

export default (state, action) => {
  const actionMethod = _.camelCase(action.type);
  if (module.exports[actionMethod]) {
    return module.exports[actionMethod](state, action);
  } else {
    return state;
  }
};
