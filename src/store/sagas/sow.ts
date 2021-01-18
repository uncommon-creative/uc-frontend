import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as SowApi from '../../api/sow'
import { actions as SowActions } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield takeLatest(SowActions.willCreateStatementOfWork.type, willCreateStatementOfWork)
  yield takeLatest(SowActions.willConfirmArbitrators.type, willConfirmArbitrators)
  yield takeLatest(SowActions.willGetSowsListSeller.type, willGetSowsListSeller)
  yield takeLatest(SowActions.willGetSowsListBuyer.type, willGetSowsListBuyer)
  yield takeLatest(SowActions.willGetSowsListArbitrator.type, willGetSowsListArbitrator)
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
    console.log("willCreateStatementOfWork result: ", result)

    yield put(push("/home"))
    yield put(NotificationActions.willShowNotification({ message: "Statement of work created", type: "success" }));
  } catch (error) {

    yield put(NotificationActions.willShowNotification({ message: error.message, type: "error" }));
  }
  yield put(UIActions.stopActivityRunning("createSOW"));
}

function* willGetSowsListSeller() {
  console.log("in willGetSowsListSeller")

  try {
    const result = yield call(SowApi.getSowsListSeller);
    console.log("result willGetSowsListSeller: ", result)
    yield put(SowActions.didGetSowsListSeller(result))

  } catch (error) {
    console.log("error in willGetSowsListSeller ", error)
  }
}

function* willGetSowsListBuyer() {
  console.log("in willGetSowsListBuyer")

  try {
    const result = yield call(SowApi.getSowsListBuyer);
    console.log("result willGetSowsListBuyer: ", result)
    yield put(SowActions.didGetSowsListBuyer(result))

  } catch (error) {
    console.log("error in willGetSowsListBuyer ", error)
  }
}

function* willGetSowsListArbitrator() {
  console.log("in willGetSowsListArbitrator")

  try {
    const result = yield call(SowApi.getSowsListArbitrator);
    console.log("result willGetSowsListArbitrator: ", result)
    yield put(SowActions.didGetSowsListArbitrator(result))

  } catch (error) {
    console.log("error in willGetSowsListArbitrator ", error)
  }
}