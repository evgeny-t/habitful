'use strict';

import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';

import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

const middlewares = [ReduxThunk];
if (!process.env.NO_LOGS) {
  middlewares.push(logger);
}

export default initState => createStore(
  reducer, initState, applyMiddleware(...middlewares));