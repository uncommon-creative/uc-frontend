import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import * as AuthApi from '../../api/auth'
import { actions as AuthActions } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield call(test, {});
  yield takeLatest(AuthActions.willLoginUser.type, willLoginUser)
  yield takeLatest(AuthActions.willSignupUser.type, willSignupUser)
  yield takeLatest(AuthActions.willConfirmUser.type, willConfirmUser)
  console.log('in auth saga');
}

function* willConfirmUser(action: any) {
  console.log("in willConfirmUser with ", action)

  try {
    yield put(UIActions.startActivityRunning("confirm"));
    localStorage.removeItem('username')

    const result = yield call(AuthApi.confirm, action.payload.username, action.payload.code)
    console.log("willConfirmUser success result ", result)
    yield put(AuthActions.didConfirmUserSuccess(result));

    yield put(NotificationActions.willShowNotification({ message: result, type: "success" }));
    action.payload.history.push('/login')
  } catch (error) {
    yield put(AuthActions.didConfirmUserFails(error));
    console.log("willConfirmUser fails error ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
    yield put(UIActions.stopActivityRunning("confirm"));
  }
}

function* willLoginUser(action: any) {
  console.log('in willLoginUser with ', action)
  try {
    const result = yield call(AuthApi.login, action.payload.username, action.payload.password)
    yield put(AuthActions.didLoginUserSuccess(result));
  } catch (error) {
    yield put(AuthActions.didLoginUserFails(error));
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}

function* willSignupUser(action: any) {
  console.log('in willSignupUser with ', action)
  try {
    yield put(UIActions.startActivityRunning("signup"));
    localStorage.setItem('username', action.payload.email)
    const result = yield call(AuthApi.signup, action.payload.email, action.payload.password, action.payload.given_name, action.payload.family_name)
    yield put(AuthActions.didSignupUserSuccess(result));
    //Redirect to Confirm 
    action.payload.history.push('/signup/confirm')
    yield put(UIActions.stopActivityRunning("signup"));
  } catch (error) {
    yield put(AuthActions.didSignupUserFails(error));
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
    yield delay(1000);
    yield put(UIActions.stopActivityRunning("signup"));
  }
}

function* test(action: any) {
  console.log('in test function');
  yield call(AuthApi.configure);
  console.log('after configure');
}
