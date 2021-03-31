import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../slices/transaction'
import { actions as UIActions } from '../slices/ui'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'
import { willSendCommandChat } from '../sagas/chat'
import { TransactionFee, AlgorandFee, AlgorandMinBalance } from '../slices/transaction'
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
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayPaid.type, willCompleteTransactionAcceptAndPayPaid)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic.type, willCompleteTransactionAcceptAndPayMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionAcceptAndPayAlgoSigner.type, willPrepareTransactionAcceptAndPayAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner.type, willCompleteTransactionAcceptAndPayAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionClaimMilestoneMetMnemonic.type, willCompleteTransactionClaimMilestoneMetMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionClaimMilestoneMetAlgoSigner.type, willPrepareTransactionClaimMilestoneMetAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionClaimMilestoneMetAlgoSigner.type, willCompleteTransactionClaimMilestoneMetAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptMilestoneMnemonic.type, willCompleteTransactionAcceptMilestoneMnemonic)
  yield takeLatest(TransactionActions.willRequestReview.type, willRequestReview)
  yield takeLatest(TransactionActions.willGetSignedMsig.type, willGetSignedMsig)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitMnemonic.type, willCompleteTransactionSubmitMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionSubmitAlgoSigner.type, willPrepareTransactionSubmitAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitAlgoSigner.type, willCompleteTransactionSubmitAlgoSigner)
  yield takeLatest(TransactionActions.willDestroyAndCreateAsset.type, willDestroyAndCreateAsset)
  console.log('in transaction saga');
}

function* willGetAlgorandAccountInfo(action: any) {
  console.log("in willGetAlgorandAccountInfo with: ", action)

  try {
    const result = yield call(TransactionApi.algorandGetAccountInfo, action);
    // console.log("result willGetAlgorandAccountInfo: ", result)
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
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPay'));
  const users = yield select(ProfileSelectors.getUsers)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: action.payload.toPay } })
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.arbitrator)
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSetSowArbitrator: ", resultSetSowArbitrator)

      const resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayMnemonic, action.payload.multiSigAddress.address, action.payload.params.withoutDelay, action.payload.mnemonicSecretKey, action.payload.toPay, users[action.payload.currentSow.buyer].public_key, users[action.payload.currentSow.seller].public_key, action.payload.assetId)
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSignedTransaction: ", resultSignedTransaction)

      const resultSentTransaction = yield call(TransactionApi.algorandSendAcceptAndPayTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction: ", resultSentTransaction)

      if (resultSentTransaction.error) {
        console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction fail: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultSentTransaction.error))
        yield put(NotificationActions.willShowNotification({ message: resultSentTransaction.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction success: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPay(resultSentTransaction))
      }
      yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultCheckAccountTransaction.error))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(error))
    yield put(NotificationActions.willShowNotification({ message: error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPay'));
}

function* willCompleteTransactionAcceptAndPayPaid(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayPaid with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPay'));
  const users = yield select(ProfileSelectors.getUsers)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: action.payload.toPay } })
    console.log("willCompleteTransactionAcceptAndPayPaid resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.arbitrator)
      console.log("willCompleteTransactionAcceptAndPayPaid resultSetSowArbitrator: ", resultSetSowArbitrator)

      const resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayPaid, action.payload.params.withoutDelay, action.payload.mnemonicSecretKey, users[action.payload.currentSow.buyer].public_key, action.payload.assetId)
      console.log("willCompleteTransactionAcceptAndPayPaid resultSignedTransaction: ", resultSignedTransaction)

      const resultSentTransaction = yield call(TransactionApi.algorandSendAcceptAndPayTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionAcceptAndPayPaid resultSentTransaction: ", resultSentTransaction)

      if (resultSentTransaction === "sendTxFailed") {
        console.log("willCompleteTransactionAcceptAndPayPaid resultSentTransaction fail: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultSentTransaction))
        yield put(NotificationActions.willShowNotification({ message: resultSentTransaction, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionAcceptAndPayPaid resultSentTransaction success: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPay(resultSentTransaction))
      }
      yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayPaid fail")
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail(resultCheckAccountTransaction.error))
    }
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayPaid ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPay'));
}

function* willPrepareTransactionAcceptAndPayAlgoSigner(action: any) {
  console.log("in willPrepareTransactionAcceptAndPayAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willPrepareTransactionAcceptAndPayAlgoSigner'));

  try {
    const resultAlgoConnect = yield call(TransactionApi.algoConnect)
    console.log("willPrepareTransactionAcceptAndPayAlgoSigner resultAlgoConnect: ", resultAlgoConnect)

    const resultAccounts = yield call(TransactionApi.algoGetAccounts)
    console.log("willPrepareTransactionAcceptAndPayAlgoSigner resultAccounts: ", resultAccounts)

    yield put(TransactionActions.didPrepareTransactionAcceptAndPayAlgoSigner(resultAccounts))

    // yield call(willAlgorandPollAccountAmount, action)
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

    // const resultAlgoSendTx = yield call(TransactionApi.algoSendTx, resultAlgoSign)
    // console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultAlgoSendTx: ", resultAlgoSendTx)

    const splittedResultAlgoSign = {
      txID: resultAlgoSign.txID,
      blob: atob(resultAlgoSign.blob).split("").map((x: any) => x.charCodeAt(0))
    }

    const resultSentTransaction = yield call(TransactionApi.algorandSendAcceptAndPayTx, action.payload.sow, splittedResultAlgoSign)
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSentTransaction: ", resultSentTransaction)

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
    console.log("error in willCompleteTransactionAcceptAndPayAlgoSigner ", error)
  }
}

function* willCompleteTransactionClaimMilestoneMetMnemonic(action: any) {
  console.log("in willCompleteTransactionClaimMilestoneMetMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionClaimMilestoneMetMnemonic'));
  const users = yield select(ProfileSelectors.getUsers)

  const hash = action.payload.hash
  const note = new Uint8Array(0);
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = configuration[stage].deliverableAsset_unitName + action.payload.currentSow.sow.substring(0, 2)
  const assetName = configuration[stage].deliverableAsset_assetName + action.payload.currentSow.sow.substring(0, 2)
  const assetURL = "https://www.example.com/" + unitName;
  // const assetMetadataHash = Buffer.from(hash).toString("base64")
  const assetMetadataHash = undefined
  console.log("willCompleteTransactionClaimMilestoneMetMnemonic assetMetadataHash: ", assetMetadataHash)
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
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: AlgorandFee } })
    console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const existingAsset = resultCheckAccountTransaction.addressInfo.createdAssets.find((asset: any) => JSON.parse(asset).params['unit-name'] === configuration[stage].deliverableAsset_unitName + action.payload.currentSow.sow.substring(0, 2))
      console.log("willCompleteTransactionClaimMilestoneMetMnemonic existingAsset: ", existingAsset)
      let resultSignedTransaction = [] as any
      if (existingAsset) {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic ASSET FOUND: ", JSON.parse(existingAsset))
        resultSignedTransaction = yield call(willDestroyAndCreateAsset, {
          payload: {
            asset: JSON.parse(existingAsset), currentSow: action.payload.currentSow, mnemonicSecretKey: action.payload.mnemonicSecretKey, params: action.payload.params.withoutDelay,
            addr: addr, note: note, totalIssuance: totalIssuance, decimals: decimals, defaultFrozen: defaultFrozen, manager: manager, reserve: reserve, freeze: freeze, clawback: clawback, unitName: unitName, assetName: assetName, assetURL: assetURL, assetMetadataHash: assetMetadataHash
          }
        })
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultSignedTransaction: ", resultSignedTransaction)
      }
      else {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic ASSET NOT FOUND")
        resultSignedTransaction = yield call(TransactionApi.signTxn,
          action.payload.mnemonicSecretKey, action.payload.params.withoutDelay, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
        )
        resultSignedTransaction = [resultSignedTransaction]
        console.log("in willCompleteTransactionClaimMilestoneMetMnemonic resultSignedTransaction: ", resultSignedTransaction)
      }

      const resultAlgorandSendDeliverableTokenCreationTx = yield call(TransactionApi.algorandSendDeliverableTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultalgorandSendDeliverableTokenCreationTx: ", resultAlgorandSendDeliverableTokenCreationTx)

      if (resultAlgorandSendDeliverableTokenCreationTx.error) {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic fail")
        yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail(resultAlgorandSendDeliverableTokenCreationTx.error))
        yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendDeliverableTokenCreationTx.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic success")
        yield put(TransactionActions.didCompleteTransactionClaimMilestoneMet(resultAlgorandSendDeliverableTokenCreationTx))
      }
    }
    else {
      console.log("willCompleteTransactionClaimMilestoneMetMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail(resultCheckAccountTransaction.error))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }

    // old
    // const mparams = {
    //   version: 1,
    //   threshold: 2,
    //   addrs: [
    //     users[action.payload.currentSow.seller].public_key,
    //     users[action.payload.currentSow.buyer].public_key,
    //     users[action.payload.currentSow.arbitrator].public_key,
    //     configuration[stage].uc_backup_public_key
    //   ],
    // };

    // try {
    //   const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: 0 } })
    //   console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    //   if (resultCheckAccountTransaction.check) {
    //     const resultSignedMultisigTransaction = yield call(TransactionApi.signMultisigTransaction, action.payload.multiSigAddress.address, users[action.payload.currentSow.seller].public_key, action.payload.params.withDelay, action.payload.mnemonicSecretKey, action.payload.currentSow.price, mparams)
    //     console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultSignedMultisigTransaction: ", resultSignedMultisigTransaction)

    //     const resultPutMultisigTransaction = yield call(TransactionApi.algorandPutTransaction, action.payload.currentSow.sow, resultSignedMultisigTransaction)
    //     console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultSignedMultisigTransaction: ", resultPutMultisigTransaction)

    //     yield call(willSendCommandChat, { payload: { values: { command: SowCommands.CLAIM_MILESTONE_MET }, sow: action.payload.currentSow } })

    //     yield put(TransactionActions.didCompleteTransactionClaimMilestoneMet())
    //   }
    //   else {
    //     console.log("willCompleteTransactionClaimMilestoneMetMnemonic fail")
    //     yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail(resultCheckAccountTransaction.error))
    //   }
  } catch (error) {
    console.log("error in willCompleteTransactionClaimMilestoneMetMnemonic ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionClaimMilestoneMetMnemonic'));
}

function* willPrepareTransactionClaimMilestoneMetAlgoSigner(action: any) {
  console.log("in willPrepareTransactionClaimMilestoneMetAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willPrepareTransactionClaimMilestoneMetAlgoSigner'));

  try {

    yield put(TransactionActions.didPrepareTransactionClaimMilestoneMetAlgoSigner())
  } catch (error) {
    console.log("error in willPrepareTransactionClaimMilestoneMetAlgoSigner ", error)
  }
  yield put(UIActions.stopActivityRunning('willPrepareTransactionClaimMilestoneMetAlgoSigner'));
}

function* willCompleteTransactionClaimMilestoneMetAlgoSigner(action: any) {
  console.log("in willCompleteTransactionClaimMilestoneMetAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionClaimMilestoneMetAlgoSigner'));

  try {

    yield put(TransactionActions.didCompleteTransactionClaimMilestoneMet())
  } catch (error) {
    console.log("error in willCompleteTransactionClaimMilestoneMetAlgoSigner ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionClaimMilestoneMetAlgoSigner'));
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

function* willCompleteTransactionAcceptMilestoneMnemonic(action: any) {
  console.log("in willCompleteTransactionAcceptMilestoneMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptMilestoneMnemonic'));
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
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: 0 } })
    console.log("willCompleteTransactionAcceptMilestoneMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const resultAppendSignMultisigTransaction = yield call(TransactionApi.appendSignMultisigTransaction, action.payload.signedMsig, action.payload.mnemonicSecretKey, msigparams)
      console.log("willCompleteTransactionAcceptMilestoneMnemonic resultAppendSignMultisigTransaction: ", resultAppendSignMultisigTransaction)
      console.log("willCompleteTransactionAcceptMilestoneMnemonic resultAppendSignMultisigTransaction.blob.toString()): ", resultAppendSignMultisigTransaction.blob.toString())

      const resultConfirmedMultisigTransaction = yield call(TransactionApi.algorandFinalizeTransaction, signedMsig.hash_round, signedMsig.round_sow, resultAppendSignMultisigTransaction)
      console.log("willCompleteTransactionAcceptMilestoneMnemonic resultConfirmedMultisigTransaction: ", resultConfirmedMultisigTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptMilestone(resultConfirmedMultisigTransaction))

      yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))
    }
    else {
      console.log("willCompleteTransactionAcceptMilestoneMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail(resultCheckAccountTransaction.error))
    }
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptMilestoneMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail("Algorand multisig transaction failed"))
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptMilestoneMnemonic'));
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

  // const tokenName = uuidv4().substring(0, 8)
  const hash = action.payload.pdfHash
  const note = undefined;
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = configuration[stage].submitAsset_unitName + action.payload.currentSow.sow.substring(0, 5)
  const assetName = configuration[stage].submitAsset_assetName + action.payload.currentSow.sow.substring(0, 5)
  const assetURL = "https://www.example.com/" + unitName;
  const assetMetadataHash = Buffer.from(hash)
  // console.log("willCompleteTransactionSubmitMnemonic assetMetadataHash: ", assetMetadataHash)
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
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: AlgorandFee } })
    console.log("willCompleteTransactionSubmitMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const existingAsset = resultCheckAccountTransaction.addressInfo.createdAssets.find((asset: any) => JSON.parse(asset).params['unit-name'] === configuration[stage].submitAsset_unitName + action.payload.currentSow.sow.substring(0, 5))
      console.log("willCompleteTransactionSubmitMnemonic existingAsset: ", existingAsset)
      let resultSignedTransaction = [] as any
      if (existingAsset) {
        console.log("willCompleteTransactionSubmitMnemonic ASSET FOUND: ", JSON.parse(existingAsset))
        resultSignedTransaction = yield call(willDestroyAndCreateAsset, {
          payload: {
            asset: JSON.parse(existingAsset), currentSow: action.payload.currentSow, mnemonicSecretKey: action.payload.mnemonicSecretKey, params: action.payload.params.withoutDelay,
            addr: addr, note: note, totalIssuance: totalIssuance, decimals: decimals, defaultFrozen: defaultFrozen, manager: manager, reserve: reserve, freeze: freeze, clawback: clawback, unitName: unitName, assetName: assetName, assetURL: assetURL, assetMetadataHash: assetMetadataHash
          }
        })
        console.log("willCompleteTransactionSubmitMnemonic resultSignedTransaction: ", resultSignedTransaction)
      }
      else {
        console.log("willCompleteTransactionSubmitMnemonic ASSET NOT FOUND")
        resultSignedTransaction = yield call(TransactionApi.signTxn,
          action.payload.mnemonicSecretKey, action.payload.params, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
        )
        resultSignedTransaction = [resultSignedTransaction]
        console.log("in willCompleteTransactionSubmitMnemonic resultSignedTransaction: ", resultSignedTransaction)
      }

      const resultAlgorandSendTokenCreationTx = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionSubmitMnemonic resultAlgorandSendTokenCreationTx: ", resultAlgorandSendTokenCreationTx)

      if (resultAlgorandSendTokenCreationTx.error) {
        console.log("willCompleteTransactionSubmitMnemonic fail")
        yield put(TransactionActions.didCompleteTransactionSubmitFail(resultAlgorandSendTokenCreationTx.error))
        yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendTokenCreationTx.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionSubmitMnemonic success")
        yield put(TransactionActions.didCompleteTransactionSubmit(resultAlgorandSendTokenCreationTx))
      }
    }
    else {
      console.log("willCompleteTransactionSubmitMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionSubmitFail(resultCheckAccountTransaction.error))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }
  } catch (error) {
    console.log("error in willCompleteTransactionSubmitMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionSubmitFail(error))
    yield put(NotificationActions.willShowNotification({ message: error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionSubmitMnemonic'));
}

function* willPrepareTransactionSubmitAlgoSigner() {
  console.log("in willPrepareTransactionSubmitAlgoSigner")
  yield put(UIActions.startActivityRunning('willPrepareTransactionSubmitAlgoSigner'));

  try {
    const resultAlgoConnect = yield call(TransactionApi.algoConnect)
    console.log("willPrepareTransactionSubmitAlgoSigner resultAlgoConnect: ", resultAlgoConnect)

    const resultAccounts = yield call(TransactionApi.algoGetAccounts)
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
      action.payload.params.withoutDelay, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
    )
    console.log("in willCompleteTransactionSubmitAlgoSigner resultSignedTransaction: ", resultSignedTransaction)

    const result = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction.toString())

    yield put(TransactionActions.didCompleteTransactionSubmit(result))
  } catch (error) {
    console.log("error in willCompleteTransactionSubmitAlgoSigner ", error)
  }
}

export function* willCheckAccountTransaction(action: any) {
  console.log("in willCheckAccountTransaction with: ", action)
  const userAttributes = yield select(ProfileSelectors.getProfile)
  // console.log("in willCheckAccountTransaction userAttributes: ", userAttributes)

  try {
    const resultMnemonicToSecretKey = yield call(TransactionApi.mnemonicToSecretKey, action.payload.mnemonicSecretKey)
    // console.log("willCheckAccountTransaction resultMnemonicToSecretKey: ", resultMnemonicToSecretKey)


    if (resultMnemonicToSecretKey.addr != userAttributes.public_key) {
      return {
        check: false,
        error: "The mnemonic secret key inserted doesn't match your public address."
      }
    }
    else {
      const addressInfo = yield call(willGetAlgorandAccountInfo, resultMnemonicToSecretKey.addr)
      // console.log("willCheckAccountTransaction addressInfo: ", addressInfo)
      const accountMinBalance = addressInfo.assets.length * AlgorandMinBalance + addressInfo.createdAssets.length * AlgorandMinBalance + AlgorandMinBalance
      // console.log("in willCheckAccountTransaction accountMinBalance: ", accountMinBalance)

      if (addressInfo.amount == 0) {
        return {
          check: false,
          error: "Your account has not the necessary balance to complete the transaction."
        }
      }
      else if ((addressInfo.amount - action.payload.toPay) < accountMinBalance) {
        return {
          check: false,
          error: `After the transaction your account would result in a balance lower than the minimum balance of ${accountMinBalance / 1000000} Algo allowed by Algorand.`
        }
      }
      else {
        return {
          check: true,
          error: null,
          addressInfo: addressInfo
        }
      }
    }
  } catch (error) {
    console.log("error in willCheckAccountTransaction ", error)
  }
}

export function* willDestroyAndCreateAsset(action: any) {
  console.log("in willDestroyAndCreateAsset with: ", action)

  try {
    const resultSignedDAndCTxn = yield call(TransactionApi.destroyAndCreateAsset,
      action.payload.mnemonicSecretKey,
      action.payload.addr,
      action.payload.note,
      action.payload.asset.index,
      action.payload.params,
      action.payload.totalIssuance,
      action.payload.decimals,
      action.payload.defaultFrozen,
      action.payload.manager,
      action.payload.reserve,
      action.payload.freeze,
      action.payload.clawback,
      action.payload.unitName,
      action.payload.assetName,
      action.payload.assetURL,
      action.payload.assetMetadataHash,
    )
    console.log("willDestroyAndCreateAsset resultDAndCTxn: ", resultSignedDAndCTxn)

    return resultSignedDAndCTxn
  } catch (error) {
    console.log("error in willDestroyAndCreateAsset ", error)
  }
}