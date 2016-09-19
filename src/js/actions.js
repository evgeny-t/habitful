'use strict';

export const ADD_HABIT = 'ADD_HABIT';

export function addHabit(habit) {
  return {
    type: ADD_HABIT,
    habit
  };
}
