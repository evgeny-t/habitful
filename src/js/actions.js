'use strict';

export const ADD_HABIT = 'ADD_HABIT';

export function addHabit(habit) {
  return {
    type: ADD_HABIT,
    habit
  };
}

export const UPDATE_DATE = 'UPDATE_DATE';

export function updateDate(date) {
  return {
    type: UPDATE_DATE,
    date
  };
}
