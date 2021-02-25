import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../slices/transaction'
import { actions as UIActions } from '../slices/ui'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'
import { willSendCommandChat } from '../sagas/chat'
import { TransactionFee } from '../slices/transaction'

export function* sagas() {
  yield takeLatest(TransactionActions.willGetAlgorandAccountInfo.type, willGetAlgorandAccountInfo)
  yield takeLatest(TransactionActions.willGetParams.type, willGetParams)
  yield takeLatest(TransactionActions.willCreateMultiSigAddress.type, willCreateMultiSigAddress)
  yield takeLatest(TransactionActions.willPreparePayment.type, willPreparePayment)
  yield takeLatest(TransactionActions.willSetSowArbitrator.type, willSetSowArbitrator)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayQR.type, willCompleteTransactionAcceptAndPayQR)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic.type, willCompleteTransactionAcceptAndPayMnemonic)
  yield takeLatest(TransactionActions.willSignTransactionClaimMilestoneMet.type, willSignTransactionClaimMilestoneMet)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptMilestone.type, willCompleteTransactionAcceptMilestone)
  console.log('in sow saga');
}

function* willGetAlgorandAccountInfo(action: any) {
  console.log("in willGetAlgorandAccountInfo with: ", action)

  try {
    const result = yield call(TransactionApi.algorandGetAccountInfo, action);
    console.log("result willGetAlgorandAccountInfo: ", result)
    // yield put(TransactionActions.didGetParams(result))
    return result
  } catch (error) {
    console.log("error in willGetAlgorandAccountInfo ", error)
  }
}

function* willGetParams(action: any) {
  console.log("in willGetParams with: ", action)

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

    const multiSigAddressInfo = yield call(willGetAlgorandAccountInfo, result)
    console.log("willCreateMultiSigAddress multiSigAddressInfo: ", multiSigAddressInfo)

    yield put(TransactionActions.didCreateMultiSigAddress(multiSigAddressInfo))

    yield call(willPreparePayment, { amount: multiSigAddressInfo.amount, price: action.payload.price, fee: TransactionFee })
  } catch (error) {
    console.log("error in willCreateMultiSigAddress ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('continueTransaction'));
}

function* willPreparePayment(action: any) {
  console.log("in willPreparePayment with: ", action)

  try {
    var payment = {
      balances: action.amount,
      price: action.price * 1000000,
      toPay: (action.price * 1000000 + TransactionFee) - (action.amount),
      fee: TransactionFee,
      total: action.price * 1000000 + TransactionFee
    }
    payment.toPay < 0 && (payment.toPay = 0)
    yield put(TransactionActions.didPreparePayment(payment))

  } catch (error) {
    console.log("error in willPreparePayment ", error)
  }
}

function* willSetSowArbitrator(action: any) {
  console.log("in willSetSowArbitrator with: ", action)

  try {
    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.sow, action.payload.arbitrator)
    console.log("willSetSowArbitrator resultSetSowArbitrator: ", resultSetSowArbitrator)
  } catch (error) {
    console.log("error in willSetSowArbitrator ", error)
  }
}

function* willCompleteTransactionAcceptAndPayQR(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayQR with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPayQR'));
  try {
    
    // const resultOnAmountChecked = yield call(TransactionApi.onAmountChecked, action.payload.currentSow.sow)
    // console.log("willCompleteTransactionAcceptAndPayQR resultOnAmountChecked: ", resultOnAmountChecked)

    const resultAlgorandPollAccountAmount = yield call(TransactionApi.algorandPollAccountAmount, action.payload.currentSow.sow, action.payload.multiSigAddress, action.payload.toPay)
    console.log("willCompleteTransactionAcceptAndPayQR resultAlgorandPollAccountAmount: ", resultAlgorandPollAccountAmount)

    // if (result) {
    //   console.log("willCompleteTransactionAcceptAndPayQR result success: ", result)
    //   const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.currentSow.arbitrator)
    //   console.log("willCompleteTransactionAcceptAndPayQR resultSetSowArbitrator: ", resultSetSowArbitrator)

    //   yield call(willSendCommandChat, { payload: { values: { command: SowCommands.ACCEPT_AND_PAY }, sow: action.payload.currentSow } })
    //   yield put(TransactionActions.didCompleteTransactionAcceptAndPayQR(result))
    // }
    // else {
    //   console.log("willCompleteTransactionAcceptAndPayQR result fail: ", result)
    //   yield put(TransactionActions.didCompleteTransactionAcceptAndPayQRFail("Not enough balance on the wallet"))
    //   yield put(NotificationActions.willShowNotification({ message: "Not enough balance on the wallet", type: "danger" }));
    // }
    // yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayQR ", error)
  }
  // yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayQR'));
}

function* willCompleteTransactionAcceptAndPayMnemonic(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPayMnemonic'));

  try {
    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.currentSow.arbitrator)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSetSowArbitrator: ", resultSetSowArbitrator)

    const resultSignedTransaction = yield call(TransactionApi.signTransaction, action.payload.multiSigAddress.address, action.payload.params, action.payload.mnemonicSecretKey, action.payload.toPay)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSignedTransaction: ", resultSignedTransaction)

    const resultSentTransaction = yield call(TransactionApi.sendTransaction, action.payload.currentSow.sow, resultSignedTransaction)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction: ", resultSentTransaction)

    if (resultSentTransaction === "sendTxFailed") {
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction fail: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayMnemonicFail(resultSentTransaction))
      yield put(NotificationActions.willShowNotification({ message: resultSentTransaction, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction success: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayMnemonic(resultSentTransaction))
    }
    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayMnemonic ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayMnemonic'));
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
    const resultSignedMultisigTransaction = yield call(TransactionApi.signMultisigTransaction, action.payload.multiSigAddress.address, action.payload.sellerAddress, action.payload.params, action.payload.mnemonicSecretKey, action.payload.currentSow.price, mparams)
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

function* willCompleteTransactionAcceptMilestone(action: any) {
  console.log("in willCompleteTransactionAcceptMilestone with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptMilestone'));
  const users = yield select(ProfileSelectors.getUsers)

  const msigparams = {
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
    const resultAppendSignMultisigTransaction = yield call(TransactionApi.appendSignMultisigTransaction, action.payload.signedMsig, action.payload.mnemonicSecretKey, msigparams)
    console.log("willCompleteTransactionAcceptMilestone resultAppendSignMultisigTransaction: ", resultAppendSignMultisigTransaction)

    const resultConfirmedMultisigTransaction = yield call(TransactionApi.confirmTxAsBuyer, action.payload.currentSow.sow, resultAppendSignMultisigTransaction)
    console.log("willCompleteTransactionAcceptMilestone resultConfirmedMultisigTransaction: ", resultConfirmedMultisigTransaction)

    if (resultConfirmedMultisigTransaction === "sendTxFailed" || resultConfirmedMultisigTransaction === "TransactionPool.Remember: txn dead:") {
      console.log("willCompleteTransactionAcceptMilestone resultConfirmedMultisigTransaction fail: ", resultConfirmedMultisigTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail("Algorand multisig transaction expired"))
      yield put(NotificationActions.willShowNotification({ message: resultConfirmedMultisigTransaction, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionAcceptMilestone resultConfirmedMultisigTransaction success: ", resultConfirmedMultisigTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptMilestone(resultConfirmedMultisigTransaction))
    }
    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptMilestone ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptMilestone'));
}