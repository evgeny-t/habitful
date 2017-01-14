'use strict';

import moment from 'moment';
import wrap from './_wrap';

wrap(module);

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

export function uploadToDriveFailed(error) {
  return {
    error,
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
      .then(resp => resp)
      .then(resp => {
        if (resp.items.length === 0) {
          return gapiInsert(gapi, fn, doc);
        } else {
          return gapiUpdate(gapi, resp.items[0].id, doc);
        }
      })
      .then(result => {
        dispatch(module.exports.uploadToDriveSucceeded());
        return result;
      })
      .catch(error => {
        dispatch(module.exports.uploadToDriveFailed(error));
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

/**
 * Should be dispatch first.
 */
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
        client_id: '832979325436-j4cbthqh279knlkhaka71qji5m95ibtf.apps.googleusercontent.com',
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

