'use strict';

import { ADD_HABIT, UPDATE_DATE } from './actions';

export default (state, action) => {
  switch (action.type) {
  case ADD_HABIT:
    return Object.assign({}, state, { 
      habits: [...state.habits, action.habit]
    });
  case UPDATE_DATE:
    return Object.assign({}, state, {
      today: action.date
    });
  default:
    return state;
  }
};
