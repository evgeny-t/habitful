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
    // now,
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
  if (user && user.getBasicProfile) {
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
  } else {
    return {
      user
    };
  }
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

export function initDriveApiSucceeded() {
  return {
  };
}

// https://developers.google.com/drive/v3/web/quickstart/js
export const initDriveApi = () => {
  return dispatch => {
    gapi.client.load('drive', 'v3', () => {
      dispatch(module.exports.initDriveApiSucceeded());

      dispatch(module.exports.uploadToDrive());
      setTimeout(() =>
        dispatch(module.exports.fetchFromDrive())
        , 1000);
    });
  };
};

export const uploadToDrive = () => {
  return dispatch => {
    gapi.client.drive.files.create({
      resource: {
        name: 'habitful.json',
        parents: ['appDataFolder']
      },
      media: {
        mimeType: 'application/json',
        body: JSON.stringify(module.exports),
      },
      fields: 'id',
    }).then(r => {
      console.log('r', r);
    });
  };
};

export const fetchFromDrive = () => {
  return dispatch => {
    var request = gapi.client.drive.files.list({
      spaces: ['appDataFolder'],
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
    });

    request.execute(function(resp) {
      console.log('resp:', resp);
      var files = resp.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(`${file.name} ( ${file.id} )`);
        }
      } else {
        console.log('No files found.');
      }
    });
  };
};

// TODO(ET): aync actions should return promises for consistency (6)

// TODO(ET): sync store with google drive (1)
// TODO(ET): think over a better way of wrapping actions to
// avoid calling them `module.exports.func` from the inside of the module.

export function initGoogleAuth() {
  const scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appfolder',
  ].join(' ');

  return (dispatch) => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '478874198596-bcmpccejmulhe4uf9o04tejtq16pbjmu.apps.googleusercontent.com',
        scope,
      }).then(() => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
          dispatch(module.exports.setUser(auth2.currentUser.get()));

          dispatch(module.exports.initDriveApi());
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

export function signOut() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      try {
        dispatch(module.exports.setUser(null));
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
      } catch (e) {
        reject(e);
      }
    });
  };
}

// export function filterLibraryItems(tag) {
//   return {
//     filter: tag,
//   };
// }

export function updateTitle(title) {
  return {
    title
  };
}

export function increaseHabitPopularity(libraryHabitId) {
  return {
    libraryHabitId,
  };
}

export function addHabitFromLibrary(libraryHabitId) {
  return {
    libraryHabitId,
  };
}

export function importHabit(libraryHabitId) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      try {
        dispatch(module.exports.increaseHabitPopularity(libraryHabitId));
        dispatch(module.exports.addHabitFromLibrary(libraryHabitId));
        dispatch(module.exports.refreshTodos());
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
