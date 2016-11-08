'use strict';

export const ADD_HABIT = 'ADD_HABIT';

export function addHabit(habit) {
  return {
    type: ADD_HABIT,
    habit,
  };
}

export const UPDATE_DATE = 'UPDATE_DATE';

export function updateDate(date) {
  return {
    type: UPDATE_DATE,
    date,
  };
}

export const MARK_ROUTINE_DONE = 'MARK_ROUTINE_DONE';

export function markRoutineDone(habitId) {
  return {
    type: MARK_ROUTINE_DONE,
    habitId,
  };
}

export const REFRESH_TODOS = 'REFRESH_TODOS';

export function refreshTodos() {
  return {
    type: REFRESH_TODOS,
  };
}

export const REFRESH_LIFETIME = 'REFRESH_LIFETIME';
export function refreshLifetime() {
  return {
    type: REFRESH_LIFETIME,
  };
}
