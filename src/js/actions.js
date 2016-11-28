'use strict';

import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid';

export function addHabit(habit) {
  return {
    habit: {
      _id: uuid.v4(),
      ...habit
    },
  };
}

export function removeHabit(habitId) {
  return {
    habitId,
    now: moment(),
  };
}

export function updateDate(date) {
  return {
    date,
  };
}

export function markRoutineDone(habitId) {
  return {
    habitId,
    now: moment(),
  };
}

export function refreshTodos() {
  return {
  };
}

export function refreshLifetime() {
  return {
  };
}

/* global gapi */

export const setUser = user => {
  const profile = user.getBasicProfile();
  return {
    user: {
      id: profile.getId(),
      name: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      imageUrl: profile.getImageUrl(),
      email: profile.getEmail(),
    }
  };
};

for (let k in module.exports) {
  if (typeof module.exports[k] === 'function') {
    const constName = _.snakeCase(module.exports[k].name).toUpperCase();
    module.exports[constName] = constName;
    const old = module.exports[k];
    module.exports[k] = (...args) => {
      const result = old(...args);
      return (typeof result === 'function') ?
        result : { type: constName, ...result };
    };
  }
}

export function setGoogleAuth2(auth2) {
  return {
    auth2
  };
}

export const initDriveApiSucceeded = () => {
  return {
  };
};

// https://developers.google.com/drive/v3/web/quickstart/js
export const initDriveApi = () => {
  return dispatch => {
    gapi.client.load('drive', 'v3', () => {
      dispatch(exports.initDriveApiSucceeded());
    });
  };
};

// TODO(ET): sync store with google drive (1)
// TODO(ET): think over a better way of wrapping actions to
// avoid calling them `module.exports.func` from the inside of the module.

export function initGoogleAuth() {
  return (dispatch) => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '478874198596-bcmpccejmulhe4uf9o04tejtq16pbjmu.apps.googleusercontent.com',
        scope: 'profile email https://www.googleapis.com/auth/drive',
      }).then(() => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
          dispatch(module.exports.setUser(auth2.currentUser.get()));
        }
      });
    });
  };
}

export function signInGoogle() {
  return (dispatch, getState) => {
    if (getState().user) {
      return;
    }

    const auth2 = gapi.auth2.getAuthInstance();
    return auth2.signIn()
      .then(() => {
        dispatch(module.exports.setUser(auth2.currentUser.get()));
      });
  };
}

