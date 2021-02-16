import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../slices/transaction'
import { actions as UIActions } from '../slices/ui'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'

export function* sagas() {
  yield takeLatest(TransactionActions.willGetParams.type, willGetParams)
  yield takeLatest(TransactionActions.willCreateMultiSigAddress.type, willCreateMultiSigAddress)
  yield takeLatest(TransactionActions.willCompleteTransaction.type, willCompleteTransaction)
  console.log('in sow saga');
}

function* willGetParams(action: any) {
  console.log("in willGetParams")

  try {
    yield call(willGetUserProfile, { user: action.payload.seller })
    yield call(willGetUserProfile, { user: action.payload.buyer })
    yield call(willGetUserProfile, { user: action.payload.arbitrator })

    const result = yield call(TransactionApi.algorandGetTxParams);
    console.log("result willGetParams: ", result)
    yield put(TransactionActions.didGetParams(result))

  } catch (error) {
    console.log("error in willGetParams ", error)
  }
}

function* willCreateMultiSigAddress(action: any) {
  console.log("in willCreateMultiSigAddress with: ", action)
  yield put(UIActions.startActivityRunning('continueTransaction'));

  const users = yield select(ProfileSelectors.getUsers)

  const seller_public_key = users[action.payload.seller].public_key
  const buyer_public_key = users[action.payload.buyer].public_key
  const arbitrator_public_key = users[action.payload.arbitrator].public_key
  const backup_public_key = "T7AVQFK7NJFFBPBZR5YPCI7KMFUPRHBOL4AV5RADWHPWC4VBVVE6PSVJXQ"

  console.log("sellerData: ", seller_public_key)
  console.log("buyerData: ", buyer_public_key)
  console.log("arbitratorData: ", arbitrator_public_key)
  console.log("backup_public_key: ", backup_public_key)

  try {
    const result = yield call(TransactionApi.createMultiSigAddress, { seller: seller_public_key, buyer: buyer_public_key, arbitrator: arbitrator_public_key, backup: backup_public_key })
    console.log("result willCreateMultiSigAddress: ", result)
    yield put(TransactionActions.didCreateMultiSigAddress(result))
  } catch (error) {
    console.log("error in willCreateMultiSigAddress ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('continueTransaction'));
}

function* willCompleteTransaction(action: any) {
  console.log("in willCompleteTransaction with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransaction'));

  try {

    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.currentSow.arbitrator)
    console.log("willCompleteTransaction resultSetSowArbitrator: ", resultSetSowArbitrator)

    const resultSignedTransaction = yield call(TransactionApi.signTransaction, action.payload.multiSigAddress, action.payload.params, action.payload.mnemonicSecretKey, action.payload.currentSow.price)
    console.log("willCompleteTransaction resultSignedTransaction: ", resultSignedTransaction)

    const resultSendedTransaction = yield call(TransactionApi.sendTransaction, action.payload.currentSow.sow, resultSignedTransaction)
    console.log("willCompleteTransaction resultSendedTransaction: ", resultSendedTransaction)

    if (resultSendedTransaction === "sendTxFailed") {
      console.log("willCompleteTransaction resultSendedTransaction fail: ", resultSendedTransaction)
      yield put(TransactionActions.didCompleteTransactionFail(resultSendedTransaction))
      yield put(NotificationActions.willShowNotification({ message: resultSendedTransaction, type: "danger" }));
    }
    else {
      console.log("willCompleteTransaction resultSendedTransaction success: ", resultSendedTransaction)
      yield put(TransactionActions.didCompleteTransaction(resultSendedTransaction))
    }
    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransaction ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransaction'));
}