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
import { configuration } from '../../config'
const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

const { "v4": uuidv4 } = require('uuid');
declare var AlgoSigner: any;

export function* sagas() {
  yield takeLatest(TransactionActions.willGetAlgorandAccountInfo.type, willGetAlgorandAccountInfo)
  yield takeLatest(TransactionActions.willGetParams.type, willGetParams)
  yield takeLatest(TransactionActions.willGetParamsWithDelay.type, willGetParamsWithDelay)
  yield takeLatest(TransactionActions.willCreateMultiSigAddress.type, willCreateMultiSigAddress)
  yield takeLatest(TransactionActions.willPreparePayment.type, willPreparePayment)
  yield takeLatest(TransactionActions.willSetSowArbitrator.type, willSetSowArbitrator)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayQR.type, willCompleteTransactionAcceptAndPayQR)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic.type, willCompleteTransactionAcceptAndPayMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionAcceptAndPayAlgoSigner.type, willPrepareTransactionAcceptAndPayAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner.type, willCompleteTransactionAcceptAndPayAlgoSigner)
  yield takeLatest(TransactionActions.willSignTransactionClaimMilestoneMet.type, willSignTransactionClaimMilestoneMet)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptMilestone.type, willCompleteTransactionAcceptMilestone)
  yield takeLatest(TransactionActions.willRequestReview.type, willRequestReview)
  yield takeLatest(TransactionActions.willGetSignedMsig.type, willGetSignedMsig)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitMnemonic.type, willCompleteTransactionSubmitMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionSubmitAlgoSigner.type, willPrepareTransactionSubmitAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitAlgoSigner.type, willCompleteTransactionSubmitAlgoSigner)
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

export function* willGetParams(action: any) {
  console.log("in willGetParams with: ", action)

  try {
    action.payload.seller && (yield call(willGetUserProfile, { user: action.payload.seller }))
    action.payload.buyer && (yield call(willGetUserProfile, { user: action.payload.buyer }))
    action.payload.arbitrator && (yield call(willGetUserProfile, { user: action.payload.arbitrator }))

    const result = yield call(TransactionApi.algorandGetTxParams);
    console.log("result willGetParams: ", result)
    yield put(TransactionActions.didGetParams(result))

  } catch (error) {
    console.log("error in willGetParams ", error)
  }
}

function* willGetParamsWithDelay(action: any) {
  console.log("in willGetParamsWithDelay with: ", action)

  try {
    yield call(willGetUserProfile, { user: action.payload.seller })
    yield call(willGetUserProfile, { user: action.payload.buyer })
    yield call(willGetUserProfile, { user: action.payload.arbitrator })

    const result = yield call(TransactionApi.algorandGetTxParamsWithDelay);
    console.log("result willGetParamsWithDelay: ", result)
    yield put(TransactionActions.didGetParamsWithDelay(result))

  } catch (error) {
    console.log("error in willGetParamsWithDelay ", error)
  }
}

function* willCreateMultiSigAddress(action: any) {
  console.log("in willCreateMultiSigAddress with: ", action)
  yield put(UIActions.startActivityRunning('continueTransaction'));

  const users = yield select(ProfileSelectors.getUsers)

  const seller_public_key = users[action.payload.seller].public_key
  const buyer_public_key = users[action.payload.buyer].public_key
  const arbitrator_public_key = users[action.payload.arbitrator].public_key
  const backup_public_key = configuration[stage].uc_backup_public_key

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
    yield call(willAlgorandPollAccountAmount, action)
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayQR ", error)
  }
}

function* willCompleteTransactionAcceptAndPayMnemonic(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPayMnemonic'));

  try {
    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.arbitrator)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSetSowArbitrator: ", resultSetSowArbitrator)

    const resultSignedTransaction = yield call(TransactionApi.signTransaction, action.payload.multiSigAddress.address, action.payload.params, action.payload.mnemonicSecretKey, action.payload.toPay)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSignedTransaction: ", resultSignedTransaction)

    const resultSentTransaction = yield call(TransactionApi.sendTransaction, action.payload.currentSow.sow, resultSignedTransaction)
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction: ", resultSentTransaction)

    if (resultSentTransaction === "sendTxFailed") {
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction fail: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultSentTransaction))
      yield put(NotificationActions.willShowNotification({ message: resultSentTransaction, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction success: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPay(resultSentTransaction))
    }
    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayMnemonic ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayMnemonic'));
}

function* willPrepareTransactionAcceptAndPayAlgoSigner(action: any) {
  console.log("in willPrepareTransactionAcceptAndPayAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willPrepareTransactionAcceptAndPayAlgoSigner'));

  try {
    const resultAlgoConnect = yield call(TransactionApi.algoConnect)
    console.log("willPrepareTransactionAcceptAndPayAlgoSigner resultAlgoConnect: ", resultAlgoConnect)

    let resultAccounts = yield call(TransactionApi.algoGetAccounts)
    console.log("willPrepareTransactionAcceptAndPayAlgoSigner resultAccounts: ", resultAccounts)

    yield put(TransactionActions.didPrepareTransactionAcceptAndPayAlgoSigner(resultAccounts))

    yield call(willAlgorandPollAccountAmount, action)
  } catch (error) {
    console.log("error in willPrepareTransactionAcceptAndPayAlgoSigner ", error)
  }
}

function* willCompleteTransactionAcceptAndPayAlgoSigner(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPayAlgoSigner'));

  try {
    const resultAlgoSign = yield call(TransactionApi.algoSign, action.payload.from, action.payload.multiSigAddress, action.payload.toPay, action.payload.sow)
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultAlgoSign: ", resultAlgoSign)

    const resultAlgoSendTx = yield call(TransactionApi.algoSendTx, resultAlgoSign)
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultAlgoSendTx: ", resultAlgoSendTx)
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayAlgoSigner ", error)
  }
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
      configuration[stage].uc_backup_public_key
    ],
  };

  try {
    const resultSignedMultisigTransaction = yield call(TransactionApi.signMultisigTransaction, action.payload.multiSigAddress.address, action.payload.sellerAddress, action.payload.params, action.payload.mnemonicSecretKey, action.payload.currentSow.price, mparams)
    console.log("willSignTransactionClaimMilestoneMet resultSignedMultisigTransaction: ", resultSignedMultisigTransaction)

    const resultPutMultisigTransaction = yield call(TransactionApi.algorandPutTransaction, action.payload.currentSow.sow, resultSignedMultisigTransaction)
    console.log("willCompleteTransactionAcceptMilestone resultSignedMultisigTransaction: ", resultPutMultisigTransaction)

    yield call(willSendCommandChat, { payload: { values: { command: SowCommands.CLAIM_MILESTONE_MET }, sow: action.payload.currentSow } })

    yield put(TransactionActions.didSignTransactionClaimMilestoneMet())

  } catch (error) {
    console.log("error in willSignTransactionClaimMilestoneMet ", error)
  }
  yield put(UIActions.stopActivityRunning('willSignTransactionClaimMilestoneMet'));
}

function* willGetSignedMsig(action: any) {
  console.log("in willGetSignedMsig with: ", action)
  yield put(UIActions.startActivityRunning('willGetSignedMsig'));

  try {
    const result = yield call(TransactionApi.algorandGetTx, action.payload.sow)
    console.log("willGetSignedMsig result: ", result)

    yield put(TransactionActions.didGetSignedMsig(result))

  } catch (error) {
    console.log("error in willGetSignedMsig ", error)
  }
  yield put(UIActions.stopActivityRunning('willGetSignedMsig'));
}

function* willCompleteTransactionAcceptMilestone(action: any) {
  console.log("in willCompleteTransactionAcceptMilestone with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptMilestone'));
  const users = yield select(ProfileSelectors.getUsers)
  const signedMsig = yield select(TransactionSelectors.getSignedMsig)

  const msigparams = {
    version: 1,
    threshold: 2,
    addrs: [
      users[action.payload.currentSow.seller].public_key,
      users[action.payload.currentSow.buyer].public_key,
      users[action.payload.currentSow.arbitrator].public_key,
      configuration[stage].uc_backup_public_key
    ],
  };

  try {
    const resultAppendSignMultisigTransaction = yield call(TransactionApi.appendSignMultisigTransaction, action.payload.signedMsig, action.payload.mnemonicSecretKey, msigparams)
    console.log("willCompleteTransactionAcceptMilestone resultAppendSignMultisigTransaction: ", resultAppendSignMultisigTransaction)
    console.log("willCompleteTransactionAcceptMilestone resultAppendSignMultisigTransaction.blob.toString()): ", resultAppendSignMultisigTransaction.blob.toString())

    const resultConfirmedMultisigTransaction = yield call(TransactionApi.algorandFinalizeTransaction, signedMsig.hash_round, signedMsig.round_sow, resultAppendSignMultisigTransaction)
    console.log("willCompleteTransactionAcceptMilestone resultConfirmedMultisigTransaction: ", resultConfirmedMultisigTransaction)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestone(resultConfirmedMultisigTransaction))

    yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))

  } catch (error) {
    console.log("error in willCompleteTransactionAcceptMilestone ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail("Algorand multisig transaction failed"))
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptMilestone'));
}

function* willRequestReview(action: any) {
  console.log("in willRequestReview with: ", action)
  yield put(UIActions.startActivityRunning('willRequestReview'));

  try {
    const result = yield call(TransactionApi.requestReview, action.payload.sow, action.payload.notes)
    console.log("willRequestReview result: ", result)

    yield put(SowActions.willGetSow({ sow: action.payload.sow }))
    yield put(TransactionActions.didRequestReview())

  } catch (error) {
    console.log("error in willRequestReview ", error)
  }
  yield put(UIActions.stopActivityRunning('willRequestReview'));
}

function* willAlgorandPollAccountAmount(action: any) {
  console.log("in willAlgorandPollAccountAmount with: ", action)
  const activePolls = yield select(TransactionSelectors.getActivePolls)

  try {
    if ((!activePolls[action.payload.sow]) || (Date.now() - activePolls[action.payload.sow]) > configuration[stage].algorand_poll_account_amount_time) {
      const resultAlgorandPollAccountAmount = yield call(TransactionApi.algorandPollAccountAmount, action.payload.sow, action.payload.multiSigAddress, action.payload.total)
      console.log("willAlgorandPollAccountAmount resultAlgorandPollAccountAmount: ", resultAlgorandPollAccountAmount)

      yield put(TransactionActions.didAlgorandPollAccountAmount({ sow: action.payload.sow, timestamp: Date.now() }))
    }

  } catch (error) {
    console.log("error in willAlgorandPollAccountAmount ", error)
  }
}

function* willCompleteTransactionSubmitMnemonic(action: any) {
  console.log("in willCompleteTransactionSubmitMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionSubmitMnemonic'));
  const users = yield select(ProfileSelectors.getUsers)

  const tokenName = uuidv4().substring(0, 8)
  const hash = action.payload.pdfHash
  const note = undefined;
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = tokenName;
  const assetName = tokenName;
  const assetURL = "https://www.example.com/" + tokenName;
  const assetMetadataHash = Buffer.from(hash, "base64")
  console.log("willCompleteTransactionSubmitMnemonic assetMetadataHash: ", assetMetadataHash)
  // Specified address can change reserve, freeze, clawback, and manager
  const manager = users[action.payload.currentSow.seller].public_key;
  // Specified address is considered the asset reserve
  // (it has no special privileges, this is only informational)
  const reserve = users[action.payload.currentSow.seller].public_key;
  // Specified address can freeze or unfreeze user asset holdings 
  const freeze = users[action.payload.currentSow.seller].public_key;
  // Specified address can revoke user asset holdings and send 
  // them to other addresses    
  const clawback = users[action.payload.currentSow.seller].public_key;

  try {
    const resultSignedTransaction = yield call(TransactionApi.signTxn,
      action.payload.mnemonicSecretKey, action.payload.params, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
    )
    console.log("in willCompleteTransactionSubmitMnemonic resultSignedTransaction: ", resultSignedTransaction)

    const resultAlgorandSendTokenCreationTx = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction.toString())
    console.log("willCompleteTransactionSubmitMnemonic resultAlgorandSendTokenCreationTx: ", resultAlgorandSendTokenCreationTx)

    if (resultAlgorandSendTokenCreationTx.error) {
      console.log("willCompleteTransactionSubmitMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionSubmitFail(resultAlgorandSendTokenCreationTx.error))
    }
    else {
      console.log("willCompleteTransactionSubmitMnemonic success")
      yield put(TransactionActions.didCompleteTransactionSubmit(resultAlgorandSendTokenCreationTx.assetId))
    }

  } catch (error) {
    console.log("error in willCompleteTransactionSubmitMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionSubmitFail())
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionSubmitMnemonic'));
}

function* willPrepareTransactionSubmitAlgoSigner() {
  console.log("in willPrepareTransactionSubmitAlgoSigner")
  yield put(UIActions.startActivityRunning('willPrepareTransactionSubmitAlgoSigner'));

  try {
    const resultAlgoConnect = yield call(TransactionApi.algoConnect)
    console.log("willPrepareTransactionSubmitAlgoSigner resultAlgoConnect: ", resultAlgoConnect)

    let resultAccounts = yield call(TransactionApi.algoGetAccounts)
    console.log("willPrepareTransactionSubmitAlgoSigner resultAccounts: ", resultAccounts)

    yield put(TransactionActions.didPrepareTransactionSubmitAlgoSigner(resultAccounts))
  } catch (error) {
    console.log("error in willPrepareTransactionSubmitAlgoSigner ", error)
  }
}

function* willCompleteTransactionSubmitAlgoSigner(action: any) {
  console.log("in willCompleteTransactionSubmitAlgoSigner")
  yield put(UIActions.startActivityRunning('willCompleteTransactionSubmitAlgoSigner'));
  const users = yield select(ProfileSelectors.getUsers)

  const tokenName = uuidv4().substring(0, 8)
  const hash = action.payload.pdfHash
  const note = undefined;
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = tokenName;
  const assetName = tokenName;
  const assetURL = "https://www.example.com/" + tokenName;
  const assetMetadataHash = Buffer.from(hash, "base64")
  console.log("willCompleteTransactionSubmitAlgoSigner assetMetadataHash: ", assetMetadataHash)
  // Specified address can change reserve, freeze, clawback, and manager
  const manager = users[action.payload.currentSow.seller].public_key;
  // Specified address is considered the asset reserve
  // (it has no special privileges, this is only informational)
  const reserve = users[action.payload.currentSow.seller].public_key;
  // Specified address can freeze or unfreeze user asset holdings 
  const freeze = users[action.payload.currentSow.seller].public_key;
  // Specified address can revoke user asset holdings and send 
  // them to other addresses    
  const clawback = users[action.payload.currentSow.seller].public_key;

  try {
    const resultSignedTransaction = yield call(TransactionApi.algoSignSubmit,
      action.payload.params, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
    )
    console.log("in willCompleteTransactionSubmitAlgoSigner resultSignedTransaction: ", resultSignedTransaction)

    // const result = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction.toString())

    // yield put(TransactionActions.didCompleteTransactionSubmit(result))
  } catch (error) {
    console.log("error in willCompleteTransactionSubmitAlgoSigner ", error)
  }
}