import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import { actions as ProfileActions } from '../slices/profile'
import { actions as AuthActions } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'

import * as ServiceApi from '../../api/service'

export function* sagas() {
  yield takeLatest(ProfileActions.willRetrieveProfileData.type, willRetrieveProfileData)
  yield takeLatest(AuthActions.didLoginUserSuccess.type, willRetrieveProfileData)

}

function* willRetrieveProfileData(action: any) {
  console.log('in willGetProfileData function');
  try {
    const result = yield call(ServiceApi.getProfileData);
    yield put(ProfileActions.didRetrieveProfileData(result))
  } catch (error) {
    console.log('Error retriving profile data', error);
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }

}