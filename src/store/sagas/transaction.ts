import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../slices/transaction'
import { actions as UIActions } from '../slices/ui'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'
import { willSendCommandChat } from '../sagas/chat'

export function* sagas() {
  yield takeLatest(TransactionActions.willGetParams.type, willGetParams)
  yield takeLatest(TransactionActions.willCreateMultiSigAddress.type, willCreateMultiSigAddress)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPay.type, willCompleteTransactionAcceptAndPay)
  yield takeLatest(TransactionActions.willSignTransactionClaimMilestoneMet.type, willSignTransactionClaimMilestoneMet)
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

function* willCompleteTransactionAcceptAndPay(action: any) {
  console.log("in willCompleteTransactionAcceptAndPay with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPay'));

  try {
    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.currentSow.arbitrator)
    console.log("willCompleteTransactionAcceptAndPay resultSetSowArbitrator: ", resultSetSowArbitrator)

    const resultSignedTransaction = yield call(TransactionApi.signTransaction, action.payload.multiSigAddress, action.payload.params, action.payload.mnemonicSecretKey, action.payload.currentSow.price)
    console.log("willCompleteTransactionAcceptAndPay resultSignedTransaction: ", resultSignedTransaction)

    const resultSendedTransaction = yield call(TransactionApi.sendTransaction, action.payload.currentSow.sow, resultSignedTransaction)
    console.log("willCompleteTransactionAcceptAndPay resultSendedTransaction: ", resultSendedTransaction)

    if (resultSendedTransaction === "sendTxFailed") {
      console.log("willCompleteTransactionAcceptAndPay resultSendedTransaction fail: ", resultSendedTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultSendedTransaction))
      yield put(NotificationActions.willShowNotification({ message: resultSendedTransaction, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionAcceptAndPay resultSendedTransaction success: ", resultSendedTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPay(resultSendedTransaction))
    }
    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPay ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPay'));
}

function* willSignTransactionClaimMilestoneMet(action: any) {
  console.log("in willSignTransactionClaimMilestoneMet with: ", action)
  yield put(UIActions.startActivityRunning('willSignTransactionClaimMilestoneMet'));
  const users = yield select(ProfileSelectors.getUsers)

  const mparams = {
    version: 1,
    threshold: 2,
    addrs: [
      users[action.payload.currentSow.seller].public_key,
      users[action.payload.currentSow.buyer].public_key,
      users[action.payload.currentSow.arbitrator].public_key,
      "T7AVQFK7NJFFBPBZR5YPCI7KMFUPRHBOL4AV5RADWHPWC4VBVVE6PSVJXQ"
    ],
  };

  try {
    const resultSignedMultisigTransaction = yield call(TransactionApi.signMultisigTransaction, action.payload.multiSigAddress, action.payload.sellerAddress, action.payload.params, action.payload.mnemonicSecretKey, action.payload.currentSow.price, mparams)
    console.log("willSignTransactionClaimMilestoneMet resultSignedMultisigTransaction: ", resultSignedMultisigTransaction)

    const resultSettedMultisigTransaction = yield call(TransactionApi.setSignedMsig, action.payload.currentSow.sow, resultSignedMultisigTransaction)
    console.log("willSignTransactionClaimMilestoneMet resultSettedMultisigTransaction: ", resultSettedMultisigTransaction)

    yield call(willSendCommandChat, { payload: { values: { command: SowCommands.CLAIM_MILESTONE_MET }, sow: action.payload.currentSow } })

    yield put(TransactionActions.didSignTransactionClaimMilestoneMet())

  } catch (error) {
    console.log("error in willSignTransactionClaimMilestoneMet ", error)
  }
  yield put(UIActions.stopActivityRunning('willSignTransactionClaimMilestoneMet'));
}