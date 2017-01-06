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

export function updateHabit(habit) {
  return {
    habit,
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

export function setUser(user) {
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
}

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

// TODO(ET): init drive api failed (4)
export function initDriveApiSucceeded() {
  return {
  };
}

// https://developers.google.com/drive/v3/web/quickstart/js
export function initDriveApi() {
  return dispatch => {
    gapi.client.load('drive', 'v2', () => {
      dispatch(module.exports.initDriveApiSucceeded());

      dispatch(module.exports.fetchFromDrive());
    });
  };
}

function _gapiUpload(gapi, method, filenameOrId, object) {
  const boundary = '-------098564-habitful-2340175';

  const metadata = {
    mimeType: 'application/json',
    // parents: [{ id: 'appfolder' }],
  };

  if (method === 'POST') {
    metadata.title = filenameOrId;
  }

  const path = '/upload/drive/v2/files' +
    (method === 'PUT' ? `/${filenameOrId}` : '');

  const request = gapi.client.request({
    path,
    method,
    params: { uploadType: 'multipart' },
    headers: {
      'Content-Type': `multipart/mixed; boundary="${boundary}"`,
    },

    body: `
--${boundary}
Content-Type: application/json

${JSON.stringify(metadata)}
--${boundary}
Content-Type: application/json

${JSON.stringify(object)}
--${boundary}--`,
  });

  return new Promise((resolve, reject) => {
    request.execute((response, raw) => {
      if (response) {
        resolve(response);
      } else {
        reject(JSON.parse(raw));
      }
    });
  });
}

function gapiGet(gapi, fileId) {
  const request = gapi.client.drive.files.get({ fileId });
  return new Promise((resolve, reject) => {
    try {
      request.execute(response => {
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function gapiDowload(gapi, gapiFile) {
  try {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const accessToken = user.getAuthResponse().access_token;
    return fetch(gapiFile.downloadUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function gapiList(gapi, filename) {
  //  and 'appfolder' in parents
  const request = gapi.client.drive.files.list({
    q: `title='${filename}' and trashed=false`,
  });
  return new Promise((resolve, reject) => {
    request.execute(response => {
      if (response.code >= 400) {
        reject(response);
      } else {
        resolve(response);
      }
    });
  });
}

function gapiInsert(gapi, filename, object) {
  return _gapiUpload(gapi, 'POST', filename, object);
}

function gapiUpdate(gapi, fileId, object) {
  return _gapiUpload(gapi, 'PUT', fileId, object);
}

const fn = 'habitful.json';

export function uploadToDriveStart() {
  return {
  };
}

export function uploadToDriveSucceeded() {
  return {
  };
}

export function uploadToDrive() {
  return (dispatch, getState) => {
    const doc = {
      habits: getState().habits,
      birthday: getState().birthday ,
      firstTime: getState().firstTime,
    };

    dispatch(module.exports.uploadToDriveStart());
    return gapiList(gapi, fn)
      .then(resp => {
        if (resp.items.length === 0) {
          return gapiInsert(gapi, fn, doc);
        } else {
          return gapiUpdate(gapi, resp.items[0].id, doc);
        }
      })
      .then(arg => {
        dispatch(module.exports.uploadToDriveSucceeded());
        return arg;
      })
      .catch(error => {
// TODO(ET): handle drive-related errors (3)
        console.log('error:', error);
      });
  };
}

export function init(slice) {
  return slice;
}

export function fetchFromDriveStart() {
  return {
  };
}

export function fetchFromDriveSucceeded() {
  return {
  };
}

export function fetchFromDriveFailed(opts) {
  return {
    ...opts,
  };
}

export function fetchFromDrive() {
  return (dispatch) => {
    dispatch(module.exports.fetchFromDriveStart());
    return gapiList(gapi, fn)
      .then(resp => {
        if (resp.items.length > 0) {
          return gapiGet(gapi, resp.items[0].id)
            .then(resp => gapiDowload(gapi, resp))
            .then(resp => resp.json());
        } else {
          dispatch(module.exports.fetchFromDriveFailed({
            message: 'file not found',
          }));
        }
      })
      .then(content => {
        if (content) {
          content.birthday = moment(content.birthday);
          content.habits = content.habits.map(h => {
            return {
              ...h,
              history: h.history ? h.history.map(historyItem => {
                return {
                  when: moment(historyItem.when),
                };
              }) : []
            };
          });

          dispatch(module.exports.init({
            habits: content.habits,
            birthday: content.birthday,
            firstTime: content.firstTime,
          }));

          dispatch(module.exports.fetchFromDriveSucceeded());
        }
      })
      .catch(error => {
        dispatch(module.exports.fetchFromDriveFailed({
          error
        }));
        throw error;
      });
  };
}

// TODO(ET): async actions should return promises for consistency (6)

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
      return Promise.resolve();
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
        resolve();
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
    newHabitId: uuid.v4(),
  };
}

export function showError(error) {
  return {
    error,
  };
}

export function importHabitError(error) {
  return dispatch => dispatch(module.exports.showError(error));
}

export function importHabit(libraryHabitId) {
  return dispatch => {
    return new Promise((resolve/*, reject*/) => {
      try {
        dispatch(module.exports.addHabitFromLibrary(libraryHabitId));
        dispatch(module.exports.increaseHabitPopularity(libraryHabitId));
        dispatch(module.exports.refreshTodos());
      } catch (error) {
        dispatch(module.exports.importHabitError(error));
        // reject(error);
      }

      resolve();
    });
  };
}

export function openDrawer() {
  return {
  };
}

export function completeTour() {
  return {};
}

export function showSetupDialog() {
  return {};
}

export function setBirthday(bd) {
  return {
    birthday: bd,
  };
}
