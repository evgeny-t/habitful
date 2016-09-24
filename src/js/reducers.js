'use strict';

import { 
  ADD_HABIT, 
  UPDATE_DATE,
  MARK_ROUTINE_DONE,
} from './actions';

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
  case MARK_ROUTINE_DONE:
    return Object.assign({}, state, {
      history: [...state.history, {
        habit: action.habitId,
        when: state.today
      }]
    });
  default:
    return state;
  }
};
