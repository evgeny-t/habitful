'use strict';

import { createStore, applyMiddleware, } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

const middlewares = [ReduxThunk];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export default initState => createStore(
  reducer, initState,
  composeWithDevTools(applyMiddleware(...middlewares)));
