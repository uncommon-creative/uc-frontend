import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import { actions as NotificationActions } from '../slices/notification' 

export function* sagas() {
  yield takeLatest(NotificationActions.willShowNotification.type, willShowNotification)
}

function* willShowNotification(action: any) {
  console.log('in willShowNotification function');
  yield delay(3000)
  yield put(NotificationActions.willHideNotification())
}
