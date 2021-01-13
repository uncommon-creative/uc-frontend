import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

import * as SowApi from '../../api/sow'
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

  const tagsSplitted = action.payload.sow.tags.split(" ")

  try {
    const result = yield call(SowApi.addStatementOfWork, action.payload.sow.arbitrators, action.payload.sow.codeOfConduct, action.payload.sow.currency, action.payload.sow.buyer, action.payload.sow.deadline, action.payload.sow.description, action.payload.sow.numberReviews, action.payload.sow.price, action.payload.sow.quantity, tagsSplitted, action.payload.sow.termsOfService, action.payload.sow.title)
    console.log("willCreateStatementOfWork succes result: ", result)

    yield put(push("/home"))
    yield put(NotificationActions.willShowNotification({ message: "Statement of work created", type: "success" }));
  } catch (error) {

    yield put(NotificationActions.willShowNotification({ message: error.message, type: "error" }));
  }
  yield put(UIActions.stopActivityRunning("createSOW"));
}

// function* willGetStatementOfWorkList() {
//   console.log("in willGetStatementOfWorkList")

//   try {
//     const result = yield call(SowApi.getStatementOfWorkList);
//     yield put(SOWActions.didGetStatementOfWorkList(result))

//     console.log("result willGetStatementOfWorkList: ", result)
//   } catch (error) {
//     console.log("error in willGetStatementOfWorkList ", error)
//   }
// }