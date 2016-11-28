'use strict';
/* eslint-env jest */

import reducer from './reducers';
import * as actions from './actions';
import moment from 'moment';
import _ from 'lodash';

describe('addHabit', () => {
  it('should add one more habit with updated `in` field', () => {
    const habit = {
      startsFrom: moment().day(-1),
      goal: 'goal',
      routine: 'routine',
      days: [true, false, false, false, false, false, false],
    };

    const before = {
      today: moment().day(0),
      habits: [],
    };

    const result = reducer(before, actions.addHabit(habit));
    expect(result.habits[0].history).toEqual([]);
    expect(result.habits[0].in).toEqual(0);
    expect(result.habits[0]._id).toBeTruthy();
    for (let key in habit) {
      expect(result.habits[0][key]).toEqual(habit[key]);
    }
  });
});

describe('removeHabit', () => {
  it('should mark habit as deleted', () => {
    const habit = {
    };
    const before = {
      today: moment().day(0),
      habits: [],
    };
    const afterAdd = reducer(before, actions.addHabit(habit));
    const afterRemove = reducer(
      afterAdd, actions.removeHabit(afterAdd.habits[0]._id));

    expect(afterRemove.habits[0].deletedAt).toBeTruthy();
  });
});

describe('markRoutineDone', () => {
  it('should add an timestamp to the history of habit', () => {
    const habit = {
    };
    const before = {
      today: moment().day(0),
      habits: [],
    };
    const afterAdd = reducer(before, actions.addHabit(habit));
    const afterDone = reducer(afterAdd,
      actions.markRoutineDone(afterAdd.habits[0]._id));
    expect(afterDone.habits[0].history[0].when).toBeTruthy();
  });
});

describe('refreshTodos', () => {
  it('should update `in`, when the next time on this week', () => {
    const today = moment().day(0); // last sunday
    const startsFrom = moment(today).subtract(1, 'week');
    const before = {
      today,
      habits: [{
        startsFrom,
        days: [false, false, false, false, false, false, false],
        history: [],
      }, {
        startsFrom,
        days: [true, false, false, false, false, false, false],
        history: [],
      }, {
        startsFrom,
        days: [false, true, false, false, false, false, false],
        history: [],
      }, {
        startsFrom,
        days: [false, false, false, false, false, false, true],
        history: [],
      }, ],
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        today: today,
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

  it('should set `in` correctly taking startsFrom into account', () => {
    const today = moment().day(0);
    const before = {
      today,
      habits: [{
        startsFrom: moment().day(3),
        goal: 'goal',
        routine: 'routine',
        days: [true, true, true, true, true, true, true],
      }]
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        ...before,
        habits: [
          {
            ...before.habits[0],
            in: 3,
          }
        ]
      });
  });
});

describe('refreshLifetime', () => {
  it('should set lifetime of state', () => {
    const birthday = moment('19900821', 'YYYYMMDD');
    const state = {
      birthday,
      habits: [{
        history: [
          { when: moment(birthday).add(1, 'days') },
          { when: moment(birthday).add(2, 'days') },
          { when: moment(birthday).add(3, 'days') },
          { when: moment(birthday).add(4, 'days') },
          { when: moment(birthday).add(5, 'days') },
        ]
      }, {
        history: [
          { when: moment(birthday).add(5, 'days') },
          { when: moment(birthday).add(8, 'days') },
        ]
      }]
    };

    expect(reducer(state, actions.refreshLifetime()))
      .toEqual({
        ...state,
        lifetime: {
          '0': 6,
          '1': 1,
          modified: 1,
        }
      });
  });
});

describe('updateDate', () => {
  it('should update and todos', () => {
    const today = moment().day(0);
    const tomorrow = moment(today).add(1, 'days');
    const state = {
      today,
      habits: [{
        days: [true, false, false, false, false, false, false],
        history: [],
      }, {
        days: [false, true, false, false, false, false, false],
        history: [],
        in: 1,
      }],
    };

    expect(reducer(state, actions.updateDate(tomorrow)))
      .toEqual({
        today: tomorrow,
        habits: [{
          ...state.habits[0],
          in: 6,
        }, {
          ...state.habits[1],
          in: 0,
        }],
      });
  });
});
