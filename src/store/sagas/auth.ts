import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import * as AuthApi from '../../api/auth'
import { actions as AuthActions } from '../slices/auth' 
import { actions as NotificationActions } from '../slices/notification' 
import { actions as UIActions } from '../slices/ui' 

export function* sagas() {
  yield call(test, {});
  yield takeLatest(AuthActions.willLoginUser.type, willLoginUser)
  yield takeLatest(AuthActions.willSignupUser.type, willSignupUser)
  console.log('in auth saga');
}

function* willLoginUser(action: any) {
  console.log('in willLoginUser with ', action)
  try{
    const result = yield call(AuthApi.login, action.payload.username, action.payload.password)
    yield put(AuthActions.didLoginUser(result));
  }catch(error){
    yield put(AuthActions.didLoginUserFails(error));
    yield put(NotificationActions.willShowNotification({message: error.message, type: "danger"}));
  }
}

function* willSignupUser(action: any) {
  console.log('in willSignupUser with ', action)
  try{
    yield put(UIActions.startActivityRunning("signup"));
    const result = yield call(AuthApi.signup, action.payload.email, action.payload.password)
    yield put(AuthActions.didSignupUserSuccess(result));
    //Redirect to Confirm 
    action.payload.history.push('/signup/confirm')
    yield put(UIActions.stopActivityRunning("signup"));
  }catch(error){
    yield put(AuthActions.didSignupUserFails(error));
    yield put(NotificationActions.willShowNotification({message: error.message, type: "danger"}));
    yield delay(1000);
    yield put(UIActions.stopActivityRunning("signup"));
  }
}

function* test(action: any) {
  console.log('in test function');
  yield call(AuthApi.configure);
  console.log('after configure');
}
