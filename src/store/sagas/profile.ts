import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import { actions as ProfileActions } from '../slices/profile'
import { actions as AuthActions } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'
import * as ServiceApi from '../../api/service'
import { actions as UIActions } from '../slices/ui'

const algosdk = require('algosdk');

export function* sagas() {
  yield takeLatest(ProfileActions.willRetrieveProfileData.type, willRetrieveProfileData)
  yield takeLatest(ProfileActions.willAddPublicKey.type, willAddPublicKey)
  yield takeLatest(AuthActions.didLoginUserSuccess.type, willRetrieveProfileData)
}

function* willRetrieveProfileData(action: any) {
  console.log('in willRetrieveProfileData with ', action);
  try {
    const result = yield call(ServiceApi.getProfileData);
    yield put(ProfileActions.didRetrieveProfileData(result))
    if (result.public_key == null) {
      yield call(willGenerateAlgoAccount)
      action.payload.history.push("/create-algo-account")
    }
    else {
      action.payload.history.push("/")
    }
  } catch (error) {
    console.log('Error retriving profile data', error);
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }

}

function* willAddPublicKey(action: any) {
  console.log("in willAddPublicKey with ", action)
  yield put(UIActions.startActivityRunning("savePublicAddress"));

  try {
    const result = yield call(ServiceApi.putProfileData, "public_key", action.publicKey)
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
    // yield call(willAddPublicKey, {publicKey: account.addr})
    yield put(ProfileActions.didGenerateAlgoAccount(account));
  } catch (error) {
    console.log("willGenerateAlgoAccount error", error)
  }
}