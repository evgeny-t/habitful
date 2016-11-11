'use strict';

export const ADD_HABIT = 'ADD_HABIT';

export function addHabit(habit) {
  return {
    type: ADD_HABIT,
    habit,
  };
}

export const REMOVE_HABIT = 'REMOVE_HABIT';

export function removeHabit(habitId) {
  return {
    type: REMOVE_HABIT,
    habitId
  };
}

export const UPDATE_DATE = 'UPDATE_DATE';

export function updateDate(date) {
  return {
    type: UPDATE_DATE,
    date,
  };
}

export const MARK_ROUTINE_DONE = 'MARK_ROUTINE_DONE';

export function markRoutineDone(habitId) {
  return {
    type: MARK_ROUTINE_DONE,
    habitId,
  };
}

export const REFRESH_TODOS = 'REFRESH_TODOS';

export function refreshTodos() {
  return {
    type: REFRESH_TODOS,
  };
}

export const REFRESH_LIFETIME = 'REFRESH_LIFETIME';
export function refreshLifetime() {
  return {
    type: REFRESH_LIFETIME,
  };
}

/* global gapi */

export const SET_GOOGLE_AUTH2 = 'SET_GOOGLE_AUTH2';
export function setGoogleAuth2(auth2) {
  return {
    type: SET_GOOGLE_AUTH2,
    auth2
  };
}

export const INIT_GOOGLE_AUTH2 = 'INIT_GOOGLE_AUTH2';
export function initGoogleAuth2() {
  return (dispatch, getState) => {
    if (getState().google && getState().google.auth2) {
      return new Promise(getState().google.auth2);
    }

    gapi.load('auth2', function() {
      const auth2 = gapi.auth2.init({
        client_id: '478874198596-bcmpccejmulhe4uf9o04tejtq16pbjmu.apps.googleusercontent.com',
        fetch_basic_profile: false,
        scope: 'profile'
      });

      dispatch(setGoogleAuth2(auth2));
      return new Promise(auth2);
    });
  };
}

export const INIT_GOOGLE_AUTH2_ERROR = 'INIT_GOOGLE_AUTH2_ERROR';
export function initGoogleAuth2Error(error) {
  return {
    type: INIT_GOOGLE_AUTH2_ERROR,
    error
  };
}

export const SIGNIN_GOOGLE_SUCCESS = 'SIGNIN_GOOGLE_SUCCESS';
export function signinGoogleSuccess(googleUser) {
  return {
    type: SIGNIN_GOOGLE_SUCCESS,
    googleUser
  };
}

export const SIGNIN_GOOGLE = 'SIGNIN_GOOGLE';
export function signInGoogle() {
  return (dispatch) => {
    return dispatch(initGoogleAuth2())
      .then(auth2 =>
        auth2.signIn()
          .then(() => {
            dispatch(signinGoogleSuccess(auth2.currentUser.get()));
          }))
      .catch(dispatch(initGoogleAuth2Error));
  };
}

