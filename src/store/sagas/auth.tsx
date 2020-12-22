import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { Button } from 'reactstrap';

import * as AuthApi from '../../api/auth'
import { actions as AuthActions } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'
import { push } from 'connected-react-router'

export function* sagas() {
  yield takeLatest(AuthActions.willLoginUser.type, willLoginUser)
  yield takeLatest(AuthActions.willLogoutUser.type, willLogoutUser)
  yield takeLatest(AuthActions.willSignupUser.type, willSignupUser)
  yield takeLatest(AuthActions.willConfirmUser.type, willConfirmUser)
  yield takeLatest(AuthActions.willForgotPasswordRequest.type, willForgotPasswordRequest)
  yield takeLatest(AuthActions.willForgotPasswordConfirm.type, willForgotPasswordConfirm)
  yield takeLatest(AuthActions.willResendSignup.type, willResendSignup)
  yield call(checkAuthentication);
  console.log('in auth saga');
}

function* checkAuthentication() {

  yield call(AuthApi.configure);
  const result = yield call(AuthApi.isAuthenticated);

  console.log('in check auth onLoad: ', result);
  if (result) {
    const user = yield call(AuthApi.getAuthenticatedUser);
    yield put(AuthActions.didLoginUserSuccess(user));
  } else {
    yield put(AuthActions.didLoginUserFails({}));
  }
}

function* willConfirmUser(action: any) {
  console.log("in willConfirmUser with ", action)
  yield put(NotificationActions.willShowNotification({ message: "Confirming username " + action.payload.username, type: "info" }))

  try {
    yield put(UIActions.startActivityRunning("confirm"));
    localStorage.removeItem('username')
    localStorage.removeItem('emailConfirm')

    const result = yield call(AuthApi.confirm, action.payload.username, action.payload.code)
    console.log("willConfirmUser success result ", result)
    yield put(AuthActions.didConfirmUserSuccess(result));

    yield put(NotificationActions.willShowNotification({ message: result, type: "success" }));
    action.payload.history.push('/login')
    yield put(UIActions.stopActivityRunning("confirm"));
  } catch (error) {
    yield put(AuthActions.didConfirmUserFails(error));
    console.log("willConfirmUser fails error ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
    yield put(UIActions.stopActivityRunning("confirm"));
  }
}

function* willLoginUser(action: any) {
  console.log('in willLoginUser with ', action)
  yield put(UIActions.startActivityRunning("login"));
  try {
    const result = yield call(AuthApi.login, action.payload.email, action.payload.password)
    console.log("result: ", result)
    yield put(AuthActions.didLoginUserSuccess({ result: result, history: action.payload.history }));
    // action.payload.history.push("/")
  } catch (error) {
    yield put(AuthActions.didLoginUserFails(error));

    if (error.code == "UserNotConfirmedException") {
      console.log('in UserNotConfirmedException');
      const message = <>User not Confirmed - <Button color="link" href="/signup/confirm">Resend confirmation Email</Button></>
      localStorage.setItem('username', action.payload.email)
      localStorage.setItem('emailConfirm', "RESEND_SIGNUP_USER")
      yield put(NotificationActions.willShowNotification({ message: message, type: "danger", delay: 10000 }));
    } else {
      yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
    }
  }
  yield put(UIActions.stopActivityRunning("login"));
}

function* willLogoutUser(action: any) {
  try {
    const result = yield call(AuthApi.logout)
    yield put(AuthActions.didLogoutUser(result));
    // action.payload.history.push("/")
    yield put(push("/"))
  } catch (error) {
    yield put(AuthActions.didLoginUserFails(error));
  }
}

function* willSignupUser(action: any) {
  console.log('in willSignupUser with ', action)
  try {
    yield put(UIActions.startActivityRunning("signup"));
    localStorage.setItem('username', action.payload.email)
    localStorage.setItem('emailConfirm', "SIGNUP_USER")
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

function* willForgotPasswordRequest(action: any) {
  console.log("in willForgotPasswordRequest with ", action)
  yield put(UIActions.startActivityRunning("requestNewPassword"));
  try {
    localStorage.setItem('username', action.payload.email)
    localStorage.setItem('emailConfirm', "PASSWORD_RESET")
    const result = yield call(AuthApi.forgotPasswordRequest, action.payload.email)
    yield put(AuthActions.didForgotPasswordRequestSuccess(result))
    yield put(NotificationActions.willShowNotification({ message: "New password requested", type: "success" }));
    action.payload.history.push("/signup/confirm/")
  } catch (error) {
    yield put(AuthActions.didForgotPasswordRequestFails(error));
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("requestNewPassword"));
}

function* willForgotPasswordConfirm(action: any) {
  console.log("in willForgotPasswordConfirm with ", action)
  yield put(UIActions.startActivityRunning("confirmNewPassword"));
  try {
    localStorage.removeItem('username')
    localStorage.removeItem('emailConfirm')
    const result = yield call(AuthApi.forgotPasswordConfirm, action.payload.email, action.payload.code, action.payload.password)
    yield put(AuthActions.didForgotPasswordConfirmSuccess(result))
    yield put(NotificationActions.willShowNotification({ message: "New password confirmed", type: "success" }));
    action.payload.history.push('/login')
  } catch (error) {
    yield put(AuthActions.didForgotPasswordConfirmFails(error));
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("confirmNewPassword"));
}

function* willResendSignup(action: any) {
  console.log("in willResendSignupConfirm with ", action)
  try {
    yield put(UIActions.startActivityRunning("resendSignupConfirm"));
    localStorage.setItem('username', action.payload.email)
    localStorage.setItem('emailConfirm', "SIGNUP_USER")
    const result = yield call(AuthApi.resendSignuUpCode, action.payload.email)
    //Redirect to Confirm
    action.payload.history.push('/signup/confirm')
  } catch (error) {
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("resendSignupConfirm"));
}