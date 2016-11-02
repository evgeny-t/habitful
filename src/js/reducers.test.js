'use strict';

import reducer from './reducers';
import * as types from './actions';

describe('1', () => {
  it('should be', () => {
    const habit = {
      type: types.ADD_HABIT,
      habit: { goal: 'goal', routine: 'routine' }
    };
    expect(reducer({}, habit))
      .toEqual({ });
  });
});

