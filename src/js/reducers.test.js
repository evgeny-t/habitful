'use strict';
/* eslint-env jest */

import reducer from './reducers';
import * as actions from './actions';
import moment from 'moment';
import _ from 'lodash';

import createStore from './store';

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

describe('updateHabit', () => {
  it('should update one habit', () => {
    const habit = i => _.assign({
      _id: `${i}`,
      goal: `goal${i}`,
      routine: `routine${i}`,
    });
    const state = {
      habits: [
        habit(1), habit(2), habit(3),
      ],
    };

    const next = reducer(state, actions.updateHabit({
      _id: '1',
      goal: 'foo',
      routine: 'bar',
    }));
    expect(next).toEqual({
      habits: [
        {
          _id: '1',
          goal: 'foo',
          routine: 'bar',
        },
        habit(2),
        habit(3),
      ],
    });
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
      days: [true, false, false, false, false, false, false],
    };
    const before = {
      today: moment().day(0),
      habits: [],
    };
    const afterAdd = reducer(before, actions.addHabit(habit));
    const afterDone = reducer(afterAdd,
      actions.markRoutineDone(afterAdd.habits[0]._id, before.today));
    expect(afterDone.habits[0].history[0].when).toBeTruthy();
    expect(afterDone.habits[0].in).toBe(7);
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

  it(`should consider that it can be more
    than 24h between history entries`, () => {
    const today = moment().day(0).startOf('date').add(6, 'h');
    const when = moment().day(-1).startOf('date').add(1, 'h');
    const before = {
      today,
      habits: [{
        days: [true, true, true, true, true, true, true],
        history: [
          { when: moment().day(-1).startOf('date').add(1, 'h') },
        ],
      }, ],
    };

    expect(reducer(before, actions.refreshTodos()))
      .toEqual({
        today,
        habits: [
          _.assign({}, before.habits[0], { in: 0 }),
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

  it(`should update 'in' correctly when
    there is a history entry for today`, () => {
    const sunday = moment().day(0);
    const before = {
      today: sunday,
      habits: [{
        days: [true, true, true, true, true, true, true],
        history: [
          { when: moment(sunday).subtract(1, 'day') },
          { when: moment(sunday).subtract(2, 'day') },
        ],
        in: 3,
      }, {
        days: [true, true, true, true, true, true, true],
        history: [
          { when: sunday },
          { when: moment(sunday).subtract(1, 'day') },
        ],
        in: 100,
      }, ],
    };

    const next = reducer(before, actions.refreshTodos());
    expect(next.today).toEqual(sunday);
    expect(next.habits[0].in).toEqual(0);
    expect(next.habits[1].in).toEqual(1);
  });


  it('reproduce a bug with incorrect \'in\' update', () => {
    const state = {
      today: moment('2017-01-16T22:33:47.956Z'),
      habits:[{
        _id:'6b193766-cbf3-4771-8784-f34aabe0fe19',
        routine:'Journaling',
        goal:'',
        days:[true,true,true,true,true,true,true],
        tags:['mindfulness'],
        history:[
          {
            when: moment('2017-01-15T19:01:18.932Z')
          },
          {
            when: moment('2017-01-16T20:49:44.883Z')
          }],
        parentId: '846ac85b-533d-4134-aa9a-df4ba535abc0',
        in: 0
      },{
        _id: '6fd1cc2b-a1ff-4c28-841e-a5853b1a9009',
        routine: 'Reading',
        goal: '',
        days: [true,true,true,true,true,true,true],
        tags: ['development'],
        history: [{
          when: moment('2017-01-15T19:01:18.932Z')}],
        parentId: 'f9bfdacb-71b0-43b0-ac9b-38e73382de5b',
        in: 0
      }],
      birthday: moment('1990-08-20T22:00:00.000Z'),
      firstTime: false
    };

    const next = reducer(state, actions.refreshTodos());
    expect(next.habits[0].in).toEqual(1);
    expect(next.habits[1].in).toEqual(0);
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

describe('importHabit', () => {
  const state = {
    today: moment().day(0),
    library: {
      items: [
        {
          _id: 'foooo-baaaar',
          name: 'foo bar',
          description: '213 foo description. see http://foo.bar/topic',
          url: '123 http://learn.more',
          image: ' 123http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
          tags: [],
        },
        {
          _id: 'e64467c5-bfe2-4043-a935-ad658f8a854d',
          name: 'foo',
          description: 'foo description. see http://foo.bar/topic',
          url: 'http://learn.more',
          image: 'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
          tags: ['foo', 'bar', 'baz'],
        },
      ],
      popularity: {
      },
    }
  };

  it('should add a new habit using a library one as a source', () => {
    const action = actions.importHabit(
      'e64467c5-bfe2-4043-a935-ad658f8a854d');
    const store = createStore(state);
    return store.dispatch(action)
      .then(() => {
        const newState = store.getState();
        expect(newState.library.popularity)
          .toEqual({
            'e64467c5-bfe2-4043-a935-ad658f8a854d': 1,
          });
        const { _id, ...habit } = newState.habits[0];
        expect(habit)
          .toEqual({
            parentId: expect.any(String),
            routine: state.library.items[1].name,
            goal: state.library.items[1].description,
            days: [true, true, true, true, true, true, true],
            tags: state.library.items[1].tags,
            history: [],
            in: 0,
          });
        expect(_id).toBeTruthy();
      });
  });

  it('should not import the same habit twice', () => {
    const action = actions.importHabit(
      'e64467c5-bfe2-4043-a935-ad658f8a854d');
    const store = createStore(state);
    return store.dispatch(action)
      .then(() => store.dispatch(action))
      .then(() => {
        expect(store.getState().library.popularity)
          .toHaveProperty('e64467c5-bfe2-4043-a935-ad658f8a854d', 1);
      });
  });
});
