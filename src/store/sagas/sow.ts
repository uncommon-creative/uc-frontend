import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import { actions as SOWActions } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'
import { push } from 'connected-react-router'

export function* sagas() {
  yield takeLatest(SOWActions.willCreateStatementOfWork.type, willCreateStatementOfWork)
  yield takeLatest(SOWActions.willConfirmArbitrators.type, willConfirmArbitrators)
  console.log('in sow saga');
}

function* willConfirmArbitrators(action: any) {
  console.log("in willConfirmArbitrators with ", action)

  yield put(UIActions.startActivityRunning("confirmArbitrators"));

  try {
    yield call(action.payload.toggle)
    yield put(NotificationActions.willShowNotification({ message: "Arbitrators selected", type: "success" }));
  } catch (error) {

    yield put(NotificationActions.willShowNotification({ message: error.message, type: "error" }));
  }
  yield put(UIActions.stopActivityRunning("confirmArbitrators"));
}

function* willCreateStatementOfWork(action: any) {
  console.log("in willCreateStatementOfWork with: ", action)

  yield put(UIActions.startActivityRunning("createSOW"));

  try {
    yield delay(3000)
    yield put(NotificationActions.willShowNotification({ message: "Statement of work created", type: "success" }));
  } catch (error) {

    yield put(NotificationActions.willShowNotification({ message: error.message, type: "error" }));
  }
  yield put(UIActions.stopActivityRunning("createSOW"));
}