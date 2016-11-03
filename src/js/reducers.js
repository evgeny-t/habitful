'use strict';

import {
  ADD_HABIT,
  UPDATE_DATE,
  MARK_ROUTINE_DONE,
  REFRESH_TODOS,
} from './actions';

import _ from 'lodash';
// import moment from 'moment';

function refreshTodos(state) {
  return Object.assign({}, state, {
    habits: state.habits.map(habit => {
      const today = state.today;
      habit = _.cloneDeep(habit);
      habit.in = null;
      let history = habit.history;
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
      }

      return habit;
    })
  });
}

export default (state, action) => {
  switch (action.type) {
  case ADD_HABIT: {
    return Object.assign({}, state, {
      habits: [...state.habits, action.habit]
    });
  }
  case UPDATE_DATE: {
    return Object.assign({}, state, {
      today: action.date
    });
  }
  case MARK_ROUTINE_DONE: {
    state = _.cloneDeep(state);

    const needsToBeUpdated =
      _.findIndex(state.habits, h => h._id === action.habitId);
    state.habits[needsToBeUpdated].history.push({
      when: state.today
    });
    state.habits[needsToBeUpdated].history.sort();
    return refreshTodos(state);
  }
  case REFRESH_TODOS:
    return refreshTodos(state);
  default:
    return state;
  }
};
