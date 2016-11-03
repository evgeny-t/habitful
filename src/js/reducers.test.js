'use strict';
/* eslint-env jest */

import reducer from './reducers';
import * as actions from './actions';
import moment from 'moment';
import _ from 'lodash';

describe('addHabit', () => {
  it('should add one more habit', () => {
    const habit = {
      goal: 'goal',
      routine: 'routine',
    };

    const before = {
      habits: [],
    };

    const after = {
      habits: [ habit ]
    };

    expect(reducer(before, actions.addHabit(habit)))
      .toEqual(after);
  });
});


describe('refreshTodos', () => {
  it('should update `in`, when the next time on this week', () => {
    const sunday = moment().day(0); // last sunday
    const before = {
      today: sunday,
      habits: [{
        days: [false, false, false, false, false, false, false],
        history: [],
      }, {
        days: [true, false, false, false, false, false, false],
        history: [],
      }, {
        days: [false, true, false, false, false, false, false],
        history: [],
      }, {
        days: [false, false, false, false, false, false, true],
        history: [],
      }, ],
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        today: sunday,
        habits: [
          _.assign({}, before.habits[0], { in: null }),
          _.assign({}, before.habits[1], { in: 0 }),
          _.assign({}, before.habits[2], { in: 1 }),
          _.assign({}, before.habits[3], { in: 6 }),
        ],
      });
  });

  it('should update `in`, when the next time on next week', () => {
    const friday = moment().day(5); // friday
    const before = {
      today: friday,
      habits: [{
        days: [true, false, false, false, false, false, false],
        history: [],
      }, {
        days: [false, true, false, false, false, false, false],
        history: [],
      }, {
        days: [false, false, false, false, false, false, true],
        history: [],
      }, ],
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        today: friday,
        habits: [
          _.assign({}, before.habits[0], { in: 2 }),
          _.assign({}, before.habits[1], { in: 3 }),
          _.assign({}, before.habits[2], { in: 1 }),
        ],
      });
  });

  it('should update `in`, when history is not empty', () => {
    const sunday = moment().day(0); // sunday
    const before = {
      today: sunday,
      habits: [{
        days: [true, false, false, false, false, false, false],
        history: [ { when: sunday } ],
      }, ],
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        today: sunday,
        habits: [
          _.assign({}, before.habits[0], { in: 7 }),
        ],
      });
  });
});
