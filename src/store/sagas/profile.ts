import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as AuthActions } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'
import * as ServiceApi from '../../api/service'
import { actions as UIActions } from '../slices/ui'
import { push } from 'connected-react-router'
const algosdk = require('algosdk');

export function* sagas() {
  yield takeLatest(ProfileActions.willRetrieveProfileData.type, willRetrieveProfileData)
  yield takeLatest(ProfileActions.willAddPublicKey.type, willAddPublicKey)
  yield takeLatest(AuthActions.didLoginUserSuccess.type, willRetrieveProfileData)
  yield takeEvery(ProfileActions.willGetUserProfile.type, willGetUserProfile)
}

function* willRetrieveProfileData(action: any) {
  console.log('in willRetrieveProfileData with ', action);
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(ServiceApi.getProfileData, null);
    yield put(ProfileActions.didRetrieveProfileData(result))
    if (result.public_key == null) {
      yield call(willGenerateAlgoAccount)
      yield put(push("/create-algo-account"))
    }
    else {
      console.log('with public_key')
    }

    // yield put(UIActions.stopLoading())
  } catch (error) {
    console.log('Error retriving profile data', error);
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}

function* willAddPublicKey(action: any) {
  console.log("in willAddPublicKey with ", action)
  yield put(UIActions.startActivityRunning("savePublicAddress"));
  const publicKey = action.payload.publicKey

  try {
    const result = yield call(ServiceApi.putProfileData, "public_key", publicKey)
    console.log("willAddPublicKey ", result)
    yield put(NotificationActions.willShowNotification({ message: "Public address saved", type: "success" }))
    action.payload.history.push('/')
  } catch (error) {
    console.log("willAddPublicKey error: ", error)
  }
  yield put(UIActions.stopActivityRunning("savePublicAddress"));
}

function* willGenerateAlgoAccount() {
  console.log("in generateAlgoAccount")
  try {
    const account = algosdk.generateAccount();
    console.log("result account: ", account)
    yield put(ProfileActions.didGenerateAlgoAccount(account));
  } catch (error) {
    console.log("willGenerateAlgoAccount error", error)
  }
}

function* willGetUserProfile(action: any) {
  console.log("in willGetUserProfile with ", action)
  const users = yield select(ProfileSelectors.getUsers)

  try {
    const existingUser = users.find((user: any) => user.user == action.payload.user)

    if (!existingUser) {
      const result = yield call(ServiceApi.getProfileData, action.payload.user);
      console.log("in willGetUserProfile result ", result)

      const newUser = result
      newUser['user'] = action.payload.user

      yield put(ProfileActions.didGetUserProfile([newUser]))
      return newUser
    }
  } catch (error) {

  }
}