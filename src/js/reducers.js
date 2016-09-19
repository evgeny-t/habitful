'use strict';

import { ADD_HABIT } from './actions';

export default (state, action) => {
  switch (action.type) {
  case ADD_HABIT:
    return Object.assign({}, state, { 
      habits: [...state.habits, action.habit]
    });
  default:
    return state;
  }
};
