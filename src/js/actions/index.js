'use strict';

// import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid';
import wrap from './_wrap';

export * from './google_drive';

wrap(module);


export function addHabit(habit) {
  return {
    habit: {
      _id: uuid.v4(),
      ...habit
    },
  };
}

export function removeHabit(habitId) {
  return {
    habitId,
    now: moment(),
  };
}

export function updateHabit(habit) {
  return {
    habit,
  };
}

export function updateDate(date) {
  return {
    date,
  };
}

export function markRoutineDone(habitId) {
  return {
    habitId,
    // now,
  };
}

export function refreshTodos() {
  return {
  };
}

export function refreshLifetime() {
  return {
  };
}

// TODO(ET): async actions should return promises for consistency (6)

// TODO(ET): think over a better way of wrapping actions to
// avoid calling them `module.exports.func` from the inside of the module.


export function updateTitle(title) {
  return {
    title
  };
}

export function increaseHabitPopularity(libraryHabitId) {
  return {
    libraryHabitId,
  };
}

export function addHabitFromLibrary(libraryHabitId) {
  return {
    libraryHabitId,
    newHabitId: uuid.v4(),
  };
}

export function showError(error) {
  return {
    error,
  };
}

export function importHabitError(error) {
  return dispatch => dispatch(module.exports.showError(error));
}

export function importHabit(libraryHabitId) {
  return dispatch => {
    return new Promise((resolve/*, reject*/) => {
      try {
        dispatch(module.exports.addHabitFromLibrary(libraryHabitId));
        dispatch(module.exports.increaseHabitPopularity(libraryHabitId));
        dispatch(module.exports.refreshTodos());
      } catch (error) {
        dispatch(module.exports.importHabitError(error));
        // reject(error);
      }

      resolve();
    });
  };
}

export function openDrawer() {
  return {
  };
}

export function completeTour() {
  return {};
}

export function showSetupDialog() {
  return {};
}

export function setBirthday(bd) {
  return {
    birthday: bd,
  };
}
