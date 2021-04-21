import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors, TransactionsMultisigFee, AlgorandFee, AlgorandMinBalance } from '../slices/transaction'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../slices/assetCurrency'
import { actions as UIActions } from '../slices/ui'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'
import { willDecryptMnemonic } from './profile'
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
  // yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayPaid.type, willCompleteTransactionAcceptAndPayPaid)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic.type, willCompleteTransactionAcceptAndPayMnemonic)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner.type, willCompleteTransactionAcceptAndPayAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionClaimMilestoneMetMnemonic.type, willCompleteTransactionClaimMilestoneMetMnemonic)
  yield takeLatest(TransactionActions.willPrepareTransactionClaimMilestoneMetAlgoSigner.type, willPrepareTransactionClaimMilestoneMetAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionClaimMilestoneMetAlgoSigner.type, willCompleteTransactionClaimMilestoneMetAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptMilestoneMnemonic.type, willCompleteTransactionAcceptMilestoneMnemonic)
  yield takeLatest(TransactionActions.willCompleteTransactionAcceptMilestoneAlgoSigner.type, willCompleteTransactionAcceptMilestoneAlgoSigner)
  yield takeLatest(TransactionActions.willRequestReview.type, willRequestReview)
  yield takeLatest(TransactionActions.willGetSignedMsig.type, willGetSignedMsig)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitMnemonic.type, willCompleteTransactionSubmitMnemonic)
  yield takeLatest(TransactionActions.willPrepareAlgoSigner.type, willPrepareAlgoSigner)
  yield takeLatest(TransactionActions.willCompleteTransactionSubmitAlgoSigner.type, willCompleteTransactionSubmitAlgoSigner)
  yield takeLatest(TransactionActions.willDestroyAndCreateAssetMnemonic.type, willDestroyAndCreateAssetMnemonic)
  console.log('in transaction saga');
}

export function* willGetAlgorandAccountInfo(action: any) {
  console.log("in willGetAlgorandAccountInfo with: ", action)

  try {
    let result = yield call(TransactionApi.algorandGetAccountInfo, action.payload);
    result.amount = result.amount / 1000000
    console.log("result willGetAlgorandAccountInfo: ", result)
    yield put(TransactionActions.didGetAlgorandAccountInfo(result))

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
    if (action.payload.sowCommand === "OptinAssetCurrency") {
      yield put(TransactionActions.didGetParams({ params: result, sowCommand: action.payload.sowCommand }))
      yield put(AssetCurrencyActions.goToModalPage({ modalPage: 1 }))
    }
    else {
      yield put(TransactionActions.didGetParams({ params: result, sowCommand: action.payload.sowCommand }))
    }
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
    yield put(TransactionActions.didGetParamsWithDelay({ params: result, sowCommand: action.payload.sowCommand }))

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

    const multiSigAddressInfo = yield call(willGetAlgorandAccountInfo, { payload: result })
    console.log("willCreateMultiSigAddress multiSigAddressInfo: ", multiSigAddressInfo)

    yield put(TransactionActions.didCreateMultiSigAddress({ multisig: multiSigAddressInfo, sowCommand: action.payload.sowCommand }))

    yield call(willPreparePayment, { payload: { multiSigAddressInfo: multiSigAddressInfo, price: action.payload.price, currency: action.payload.currency } })
  } catch (error) {
    console.log("error in willCreateMultiSigAddress ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('continueTransaction'));
}

function* willPreparePayment(action: any) {
  console.log("in willPreparePayment with: ", action)
  const assetsCurrencies = yield select(AssetCurrencySelectors.getAssetsCurrencies)

  const assetCurrencyIndex = action.payload.currency == "ALGO" ? undefined : assetsCurrencies.find((asset: any) => asset.assetName === action.payload.currency).assetIndex
  console.log("willPreparePayment assetCurrencyIndex: ", assetCurrencyIndex)
  const multisigAsset = action.payload.multiSigAddressInfo.assets.find((asset: any) => JSON.parse(asset)['asset-id'] === assetCurrencyIndex)
  console.log("willPreparePayment multisigAsset: ", multisigAsset)

  try {
    let payment = {
      balancesAlgo: action.payload.multiSigAddressInfo.amount,
      balancesAssetCurrency: action.payload.currency == "ALGO" ? undefined : multisigAsset ? JSON.parse(multisigAsset).amount : -1,
      price: action.payload.price,
      currency: action.payload.currency,
      feeAlgo: TransactionsMultisigFee / 1000000,
      feeAssetCurrency: 0,
      toPayAlgo: (action.payload.currency == "ALGO" ? action.payload.price + (TransactionsMultisigFee / 1000000) : (TransactionsMultisigFee / 1000000)),
      toPayAssetCurrency: action.payload.currency == "ALGO" ? 0 : action.payload.price
    }
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
  const assetsCurrencies = yield select(AssetCurrencySelectors.getAssetsCurrencies)
  const assetCurrencyIndex = action.payload.payment.currency == "ALGO" ? undefined : assetsCurrencies.find((asset: any) => asset.assetName === action.payload.payment.currency).assetIndex

  let mnemonicSecretKey = ''
  if (action.payload.saveMnemonic && action.payload.saveMnemonic.save) {
    // DECRYPT
    mnemonicSecretKey = yield call(willDecryptMnemonic, { payload: { encryptedMnemonic: action.payload.saveMnemonic.encryptedMnemonic, password: action.payload.password, salt: action.payload.saveMnemonic.salt } })
  }
  else {
    mnemonicSecretKey = action.payload.mnemonicSecretKey
  }
  console.log("willCompleteTransactionAcceptAndPayMnemonic mnemonicSecretKey: ", mnemonicSecretKey)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: mnemonicSecretKey, toPayAlgo: action.payload.payment.toPayAlgo, toPayAssetCurrency: action.payload.payment.toPayAssetCurrency, currency: action.payload.payment.currency } })
    console.log("willCompleteTransactionAcceptAndPayMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.arbitrator)
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSetSowArbitrator: ", resultSetSowArbitrator)

      let resultSignedTransaction = [] as any

      // CHECK CURRENCY ALGO
      if (action.payload.currentSow.currency == "ALGO") {
        console.log("willCompleteTransactionAcceptAndPayMnemonic CHECK CURRENCY ALGO")
        // if (action.payload.toPay <= 0) {
        //   resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayMnemonicPaid, action.payload.params.withoutDelay, mnemonicSecretKey, users[action.payload.currentSow.buyer].public_key, action.payload.assetId)
        //   console.log("willCompleteTransactionAcceptAndPayMnemonic PAID resultSignedTransaction: ", resultSignedTransaction)
        // }
        // else {
        resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayMnemonicAlgo, action.payload.multiSig.address, action.payload.params.withoutDelay, mnemonicSecretKey, action.payload.payment.toPayAlgo, users[action.payload.currentSow.buyer].public_key, action.payload.assetId)
        console.log("willCompleteTransactionAcceptAndPayMnemonic ALGO resultSignedTransaction: ", resultSignedTransaction)
        // }
      }
      // CHECK ASSET CURRENCY
      else {
        console.log("willCompleteTransactionAcceptAndPayMnemonic CHECK ASSET CURRENCY")
        // CHECK MSIG OPTIN ASSET CURRENCY TO-DO
        if (action.payload.payment.balancesAssetCurrency == -1) {
          console.log("willCompleteTransactionAcceptAndPayMnemonic CHECK MSIG OPTIN ASSET CURRENCY TO-DO")
          const mparams = {
            version: 1,
            threshold: 2,
            addrs: [
              users[action.payload.currentSow.seller].public_key,
              users[action.payload.currentSow.buyer].public_key,
              users[action.payload.arbitrator].public_key,
              configuration[stage].uc_backup_public_key
            ],
          };

          resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayMnemonicAssetOptin, action.payload.multiSig.address, action.payload.params.withoutDelay, mnemonicSecretKey, action.payload.payment.toPayAlgo, action.payload.payment.toPayAssetCurrency, users[action.payload.currentSow.buyer].public_key, action.payload.assetId, assetCurrencyIndex, mparams)
          console.log("willCompleteTransactionAcceptAndPayMnemonic ASSET OPTIN resultSignedTransaction: ", resultSignedTransaction)
        }
        // CHECK MSIG OPTIN ASSET CURRENCY DONE
        else {
          console.log("willCompleteTransactionAcceptAndPayMnemonic CHECK MSIG OPTIN ASSET CURRENCY DONE")
          resultSignedTransaction = yield call(TransactionApi.signTransactionsAcceptAndPayMnemonicAsset, action.payload.multiSig.address, action.payload.params.withoutDelay, mnemonicSecretKey, action.payload.payment.toPayAlgo, action.payload.payment.toPayAssetCurrency, users[action.payload.currentSow.buyer].public_key, action.payload.assetId, assetCurrencyIndex)
          console.log("willCompleteTransactionAcceptAndPayMnemonic ASSET resultSignedTransaction: ", resultSignedTransaction)
        }
      }

      const resultSentTransaction = yield call(TransactionApi.algorandSendAcceptAndPayTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction: ", resultSentTransaction)

      if (resultSentTransaction.error) {
        console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction fail: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail({ error: resultSentTransaction.error, sowCommand: SowCommands.ACCEPT_AND_PAY }))
        yield put(NotificationActions.willShowNotification({ message: resultSentTransaction.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionAcceptAndPayMnemonic resultSentTransaction success: ", resultSentTransaction)
        yield put(TransactionActions.didCompleteTransactionAcceptAndPay({ tx: resultSentTransaction, sowCommand: SowCommands.ACCEPT_AND_PAY }))
      }
      yield put(SowActions.willGetSow({ sow: action.payload.currentSow.sow }))
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail({ error: resultCheckAccountTransaction.error, sowCommand: SowCommands.ACCEPT_AND_PAY }))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptAndPayMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail({ error: error, sowCommand: SowCommands.ACCEPT_AND_PAY }))
    yield put(NotificationActions.willShowNotification({ message: error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPay'));
}

function* willCompleteTransactionAcceptAndPayAlgoSigner(action: any) {
  console.log("in willCompleteTransactionAcceptAndPayAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptAndPayAlgoSigner'));
  const users = yield select(ProfileSelectors.getUsers)

  try {
    const resultSetSowArbitrator = yield call(TransactionApi.setSowArbitrator, action.payload.currentSow.sow, action.payload.arbitrator)
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSetSowArbitrator: ", resultSetSowArbitrator)

    let resultSignedTransaction = [] as any
    // if (action.payload.toPay <= 0) {
    //   const resultTransactions = yield call(TransactionApi.createTransactionsAcceptAndPayPaidAlgoSigner, action.payload.params.withoutDelay, users[action.payload.currentSow.buyer].public_key, action.payload.assetId)
    //   console.log("in willCompleteTransactionAcceptAndPayAlgoSigner resultTransactions: ", resultTransactions)

    //   const resultOptinTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions[0])
    //   console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultOptinTxnSigned: ", resultOptinTxnSigned)

    //   resultSignedTransaction = [resultOptinTxnSigned]
    //   console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSignedTransactions: ", resultSignedTransaction)
    // }
    // else {
    const resultTransactions = yield call(TransactionApi.createTransactionsAcceptAndPayAlgoSigner, action.payload.multiSigAddress, action.payload.params.withoutDelay, action.payload.payment.toPay, users[action.payload.currentSow.buyer].public_key, action.payload.assetId)
    console.log("in willCompleteTransactionAcceptAndPayAlgoSigner resultTransactions: ", resultTransactions)

    const resultOptinTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions[0])
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultOptinTxnSigned: ", resultOptinTxnSigned)

    //// DID

    const resultPaymentTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions[1])
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultPaymentTxnSigned: ", resultPaymentTxnSigned)

    resultSignedTransaction = [resultOptinTxnSigned, resultPaymentTxnSigned]
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSignedTransactions: ", resultSignedTransaction)
    // }

    const resultSentTransaction = yield call(TransactionApi.algorandSendAcceptAndPayTx, action.payload.currentSow.sow, resultSignedTransaction)
    console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSentTransaction: ", resultSentTransaction)

    if (resultSentTransaction.error) {
      console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSentTransaction fail: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPayFail({ error: resultSentTransaction.error, sowCommand: SowCommands.ACCEPT_AND_PAY }))
      yield put(NotificationActions.willShowNotification({ message: resultSentTransaction.error, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionAcceptAndPayAlgoSigner resultSentTransaction success: ", resultSentTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptAndPay({ tx: resultSentTransaction, sowCommand: SowCommands.ACCEPT_AND_PAY }))
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
  const assetsCurrencies = yield select(AssetCurrencySelectors.getAssetsCurrencies)

  const hash = action.payload.hash
  const note = undefined;
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = configuration[stage].deliverableAsset_unitName + action.payload.currentSow.sow.substring(0, 2)
  const assetName = configuration[stage].deliverableAsset_assetName + action.payload.currentSow.sow.substring(0, 2)
  const assetURL = "https://www.example.com/" + unitName;
  const assetMetadataHash = Buffer.from(hash)
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

  let mnemonicSecretKey = ''
  if (action.payload.saveMnemonic && action.payload.saveMnemonic.save) {
    // DECRYPT
    mnemonicSecretKey = yield call(willDecryptMnemonic, { payload: { encryptedMnemonic: action.payload.saveMnemonic.encryptedMnemonic, password: action.payload.password, salt: action.payload.saveMnemonic.salt } })
  }
  else {
    mnemonicSecretKey = action.payload.mnemonicSecretKey
  }
  console.log("willCompleteTransactionClaimMilestoneMetMnemonic mnemonicSecretKey: ", mnemonicSecretKey)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: mnemonicSecretKey, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' } })
    console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      // const existingAsset = resultCheckAccountTransaction.addressInfo.createdAssets.find((asset: any) => JSON.parse(asset).params['unit-name'] === configuration[stage].deliverableAsset_unitName + action.payload.currentSow.sow.substring(0, 2))
      // console.log("willCompleteTransactionClaimMilestoneMetMnemonic existingAsset: ", existingAsset)
      let resultSignedTransaction = [] as any
      // if (existingAsset) {
      //   console.log("willCompleteTransactionClaimMilestoneMetMnemonic ASSET FOUND: ", JSON.parse(existingAsset))
      //   resultSignedTransaction = yield call(willDestroyAndCreateAssetMnemonic, {
      //     payload: {
      //       asset: JSON.parse(existingAsset), currentSow: action.payload.currentSow, mnemonicSecretKey: mnemonicSecretKey, params: action.payload.params.withoutDelay,
      //       addr: addr, note: note, totalIssuance: totalIssuance, decimals: decimals, defaultFrozen: defaultFrozen, manager: manager, reserve: reserve, freeze: freeze, clawback: clawback, unitName: unitName, assetName: assetName, assetURL: assetURL, assetMetadataHash: assetMetadataHash
      //     }
      //   })
      //   console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultSignedTransaction: ", resultSignedTransaction)
      // }
      // else {
      // console.log("willCompleteTransactionClaimMilestoneMetMnemonic ASSET NOT FOUND")
      resultSignedTransaction = yield call(TransactionApi.signTxn,
        mnemonicSecretKey, action.payload.params.withoutDelay, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
      )
      console.log("in willCompleteTransactionClaimMilestoneMetMnemonic resultSignedTransaction: ", resultSignedTransaction)
      // }

      const resultAlgorandSendDeliverableTokenCreationTx = yield call(TransactionApi.algorandSendDeliverableTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultalgorandSendDeliverableTokenCreationTx: ", resultAlgorandSendDeliverableTokenCreationTx)

      if (resultAlgorandSendDeliverableTokenCreationTx.error) {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultAlgorandSendDeliverableTokenCreationTx fail")
        yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail({ error: resultAlgorandSendDeliverableTokenCreationTx.error, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
        yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendDeliverableTokenCreationTx.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultAlgorandSendDeliverableTokenCreationTx success")

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

        let resultClaimMilestoneMetTxGroup = [] as any
        // CHECK CURRENCY ALGO
        if (action.payload.currentSow.currency == 'ALGO') {
          resultClaimMilestoneMetTxGroup = yield call(TransactionApi.signTransactionsClaimMilestoneMetMnemonicAlgo, action.payload.multiSigAddress, users[action.payload.currentSow.seller].public_key, action.payload.params.withDelay, mnemonicSecretKey, action.payload.currentSow.price, mparams, users[action.payload.currentSow.buyer].public_key, resultAlgorandSendDeliverableTokenCreationTx.assetId)
          console.log("willCompleteTransactionClaimMilestoneMetMnemonic ALGO resultSignedMultisigTransaction: ", resultClaimMilestoneMetTxGroup)
        }
        // CHECK ASSET CURRENCY
        else {
          const assetCurrencyIndex = assetsCurrencies.find((asset: any) => asset.assetName === action.payload.currentSow.currency).assetIndex
          // console.log("willCompleteTransactionClaimMilestoneMetMnemonic assetCurrencyIndex: ", assetCurrencyIndex)

          resultClaimMilestoneMetTxGroup = yield call(TransactionApi.signTransactionsClaimMilestoneMetMnemonicAsset, action.payload.multiSigAddress, users[action.payload.currentSow.seller].public_key, action.payload.params.withDelay, mnemonicSecretKey, action.payload.currentSow.price, mparams, users[action.payload.currentSow.buyer].public_key, resultAlgorandSendDeliverableTokenCreationTx.assetId, assetCurrencyIndex)
          console.log("willCompleteTransactionClaimMilestoneMetMnemonic ASSET resultSignedMultisigTransaction: ", resultClaimMilestoneMetTxGroup)
        }
        const resultAlgorandSendClaimMilestoneMet = yield call(TransactionApi.algorandSendClaimMilestoneMet, action.payload.currentSow.sow, resultClaimMilestoneMetTxGroup.tx, resultClaimMilestoneMetTxGroup.backupTx)
        console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultAlgorandSendClaimMilestoneMet: ", resultAlgorandSendClaimMilestoneMet)

        if (resultAlgorandSendClaimMilestoneMet.error) {
          console.log("willCompleteTransactionClaimMilestoneMetMnemonic resultAlgorandSendClaimMilestoneMet fail")
          yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail({ error: resultAlgorandSendClaimMilestoneMet.error, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
          yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendClaimMilestoneMet.error, type: "danger" }))
        }
        else {
          yield put(TransactionActions.didCompleteTransactionClaimMilestoneMet({ tx: resultAlgorandSendDeliverableTokenCreationTx, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
          yield put(NotificationActions.willShowNotification({ message: "Milestone claimed as met", type: "info" }));
        }
      }
    }
    else {
      console.log("willCompleteTransactionClaimMilestoneMetMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail({ error: resultCheckAccountTransaction.error, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }
  } catch (error) {
    console.log("error in willCompleteTransactionClaimMilestoneMetMnemonic ", error)
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionClaimMilestoneMetMnemonic'));
}

function* willPrepareTransactionClaimMilestoneMetAlgoSigner(action: any) {
  console.log("in willPrepareTransactionClaimMilestoneMetAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willPrepareTransactionClaimMilestoneMetAlgoSigner'));

  try {

    yield put(TransactionActions.didPrepareTransactionClaimMilestoneMetAlgoSigner({ sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
  } catch (error) {
    console.log("error in willPrepareTransactionClaimMilestoneMetAlgoSigner ", error)
  }
  yield put(UIActions.stopActivityRunning('willPrepareTransactionClaimMilestoneMetAlgoSigner'));
}

function* willCompleteTransactionClaimMilestoneMetAlgoSigner(action: any) {
  console.log("in willCompleteTransactionClaimMilestoneMetAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionClaimMilestoneMetAlgoSigner'));
  const users = yield select(ProfileSelectors.getUsers)

  const hash = action.payload.hash
  const note = undefined;
  const defaultFrozen = false;
  const addr = users[action.payload.currentSow.seller].public_key;
  const decimals = 0;
  const totalIssuance = 1;
  const unitName = configuration[stage].deliverableAsset_unitName + action.payload.currentSow.sow.substring(0, 2)
  const assetName = configuration[stage].deliverableAsset_assetName + action.payload.currentSow.sow.substring(0, 2)
  const assetURL = "https://www.example.com/" + unitName;
  const assetMetadataHash = hash // senza Buffer.from per AlgoSigner
  console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner assetMetadataHash: ", assetMetadataHash)
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

    let resultSignedTransactions = [] as any
    // if (existingAsset) {
    //   console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner ASSET FOUND: ", JSON.parse(existingAsset))
    //   resultSignedTransactions = yield call(willDestroyAndCreateAssetMnemonic, {
    //     payload: {
    //       asset: JSON.parse(existingAsset), currentSow: action.payload.currentSow, mnemonicSecretKey: action.payload.mnemonicSecretKey, params: action.payload.params.withoutDelay,
    //       addr: addr, note: note, totalIssuance: totalIssuance, decimals: decimals, defaultFrozen: defaultFrozen, manager: manager, reserve: reserve, freeze: freeze, clawback: clawback, unitName: unitName, assetName: assetName, assetURL: assetURL, assetMetadataHash: assetMetadataHash
    //     }
    //   })
    //   console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultSignedTransactions: ", resultSignedTransactions)
    // }
    // else {
    // console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner ASSET NOT FOUND")
    resultSignedTransactions = yield call(TransactionApi.createAssetAlgoSigner,
      addr,
      note,
      action.payload.params.withoutDelay,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash
    )
    console.log("in willCompleteTransactionClaimMilestoneMetAlgoSigner resultSignedTransactions: ", resultSignedTransactions)
    // }

    const resultAlgorandSendDeliverableTokenCreationTx = yield call(TransactionApi.algorandSendDeliverableTokenCreationTx, action.payload.currentSow.sow, resultSignedTransactions)
    console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultalgorandSendDeliverableTokenCreationTx: ", resultAlgorandSendDeliverableTokenCreationTx)

    if (resultAlgorandSendDeliverableTokenCreationTx.error) {
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultAlgorandSendDeliverableTokenCreationTx fail")
      yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail({ error: resultAlgorandSendDeliverableTokenCreationTx.error, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
      yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendDeliverableTokenCreationTx.error, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultAlgorandSendDeliverableTokenCreationTx success")

      const resultTransactions = yield call(TransactionApi.createTransactionsClaimMilestonMetAlgoSigner, action.payload.multiSigAddress, users[action.payload.currentSow.seller].public_key, action.payload.params.withDelay, action.payload.currentSow.price, users[action.payload.currentSow.buyer].public_key, resultAlgorandSendDeliverableTokenCreationTx.assetId)
      console.log("in willCompleteTransactionClaimMilestoneMetAlgoSigner resultTransactions: ", resultTransactions)

      const resultPaymentBackupTxnSigned = yield call(TransactionApi.signMultisigTxAlgoSigner,
        resultTransactions.backupTx,
        [
          users[action.payload.currentSow.seller].public_key,
          users[action.payload.currentSow.buyer].public_key,
          users[action.payload.currentSow.arbitrator].public_key,
          configuration[stage].uc_backup_public_key
        ]
      )
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultPaymentBackupTxnSigned: ", resultPaymentBackupTxnSigned)
      const backupTxnSigned = [resultPaymentBackupTxnSigned]
      const resultPaymentGroupTxnSigned = yield call(TransactionApi.signMultisigTxAlgoSigner,
        resultTransactions.tx[0],
        [
          users[action.payload.currentSow.seller].public_key,
          users[action.payload.currentSow.buyer].public_key,
          users[action.payload.currentSow.arbitrator].public_key,
          configuration[stage].uc_backup_public_key
        ]
      )
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultPaymentGroupTxnSigned: ", resultPaymentGroupTxnSigned)
      // const resultOptinTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions.tx[1])
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultTransactions.tx[1]: ", resultTransactions.tx[1])
      const resultAssetTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions.tx[2])
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultAssetTxnSigned: ", resultAssetTxnSigned)
      const groupTxnSigned = [resultPaymentGroupTxnSigned, resultTransactions.tx[1], resultAssetTxnSigned]
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner groupTxnSigned: ", groupTxnSigned)

      const resultAlgorandSendClaimMilestoneMet = yield call(TransactionApi.algorandSendClaimMilestoneMet, action.payload.currentSow.sow, groupTxnSigned, backupTxnSigned)
      console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultAlgorandSendClaimMilestoneMet: ", resultAlgorandSendClaimMilestoneMet)

      if (resultAlgorandSendClaimMilestoneMet.error) {
        console.log("willCompleteTransactionClaimMilestoneMetAlgoSigner resultAlgorandSendClaimMilestoneMet fail")
        yield put(TransactionActions.didCompleteTransactionClaimMilestoneMetFail({ error: resultAlgorandSendClaimMilestoneMet.error, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
        yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendClaimMilestoneMet.error, type: "danger" }))
      }
      else {
        yield put(TransactionActions.didCompleteTransactionClaimMilestoneMet({ tx: resultAlgorandSendDeliverableTokenCreationTx, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
        yield put(NotificationActions.willShowNotification({ message: "Milestone claimed as met", type: "info" }));
      }
    }
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

    yield put(TransactionActions.didGetSignedMsig({ signedMsig: result, sowCommand: SowCommands.ACCEPT_MILESTONE }))

  } catch (error) {
    console.log("error in willGetSignedMsig ", error)
  }
  yield put(UIActions.stopActivityRunning('willGetSignedMsig'));
}

function* willCompleteTransactionAcceptMilestoneMnemonic(action: any) {
  console.log("in willCompleteTransactionAcceptMilestoneMnemonic with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptMilestoneMnemonic'));
  const users = yield select(ProfileSelectors.getUsers)

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

  let mnemonicSecretKey = ''
  if (action.payload.saveMnemonic && action.payload.saveMnemonic.save) {
    // DECRYPT
    mnemonicSecretKey = yield call(willDecryptMnemonic, { payload: { encryptedMnemonic: action.payload.saveMnemonic.encryptedMnemonic, password: action.payload.password, salt: action.payload.saveMnemonic.salt } })
  }
  else {
    mnemonicSecretKey = action.payload.mnemonicSecretKey
  }
  console.log("willCompleteTransactionAcceptMilestoneMnemonic mnemonicSecretKey: ", mnemonicSecretKey)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: mnemonicSecretKey, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' } })
    console.log("willCompleteTransactionAcceptMilestoneMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      const resultSignGroupAcceptMilestone = yield call(TransactionApi.signGroupAcceptMilestoneMnemonic, action.payload.signedMsig, mnemonicSecretKey, msigparams)
      console.log("willCompleteTransactionAcceptMilestoneMnemonic resultSignGroupAcceptMilestone: ", resultSignGroupAcceptMilestone)

      const resultConfirmedMultisigTransaction = yield call(TransactionApi.algorandFinalizeTransaction, action.payload.signedMsig.hash_round, action.payload.signedMsig.round_sow, resultSignGroupAcceptMilestone)
      console.log("willCompleteTransactionAcceptMilestoneMnemonic resultConfirmedMultisigTransaction: ", resultConfirmedMultisigTransaction)
      yield put(TransactionActions.didCompleteTransactionAcceptMilestone({ tx: resultConfirmedMultisigTransaction, sowCommand: SowCommands.ACCEPT_MILESTONE }))
      yield put(NotificationActions.willShowNotification({ message: "Milestone accepted", type: "info" }));
    }
    else {
      console.log("willCompleteTransactionAcceptMilestoneMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail({ error: resultCheckAccountTransaction.error, sowCommand: SowCommands.ACCEPT_MILESTONE }))
    }
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptMilestoneMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail({ error: "Algorand multisig transaction failed", sowCommand: SowCommands.ACCEPT_MILESTONE }))
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptMilestoneMnemonic'));
}

function* willCompleteTransactionAcceptMilestoneAlgoSigner(action: any) {

  console.log("in willCompleteTransactionAcceptMilestoneAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionAcceptMilestoneAlgoSigner'));
  const users = yield select(ProfileSelectors.getUsers)

  try {
    let resultSignGroupAcceptMilestone = yield call(TransactionApi.createTransactionsAcceptMilestoneAlgoSigner, action.payload.signedMsig.tx)

    const resultPaymentTxnSigned = yield call(TransactionApi.signAppendMultisigTxAlgoSigner, resultSignGroupAcceptMilestone.payment)
    // console.log("willCompleteTransactionAcceptMilestoneAlgoSigner resultPaymentTxnSigned: ", resultPaymentTxnSigned)
    const resultOptinTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultSignGroupAcceptMilestone.optin)
    // console.log("willCompleteTransactionAcceptMilestoneAlgoSigner resultOptinTxnSigned: ", resultOptinTxnSigned)

    resultSignGroupAcceptMilestone = [resultPaymentTxnSigned, resultOptinTxnSigned, action.payload.signedMsig.tx[2]]
    console.log("willCompleteTransactionAcceptMilestoneAlgoSigner resultSignGroupAcceptMilestone: ", resultSignGroupAcceptMilestone)

    const resultConfirmedMultisigTransaction = yield call(TransactionApi.algorandFinalizeTransaction, action.payload.signedMsig.hash_round, action.payload.signedMsig.round_sow, resultSignGroupAcceptMilestone)
    console.log("willCompleteTransactionAcceptMilestoneAlgoSigner resultConfirmedMultisigTransaction: ", resultConfirmedMultisigTransaction)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestone({ tx: resultConfirmedMultisigTransaction, sowCommand: SowCommands.ACCEPT_MILESTONE }))
    yield put(NotificationActions.willShowNotification({ message: "Milestone accepted", type: "info" }));
  } catch (error) {
    console.log("error in willCompleteTransactionAcceptMilestoneAlgoSigner ", error)
    yield put(TransactionActions.didCompleteTransactionAcceptMilestoneFail({ error: "Algorand multisig transaction failed", sowCommand: SowCommands.ACCEPT_MILESTONE }))
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionAcceptMilestoneAlgoSigner'));
}

function* willRequestReview(action: any) {
  console.log("in willRequestReview with: ", action)
  yield put(UIActions.startActivityRunning('willRequestReview'));

  try {
    const result = yield call(TransactionApi.requestReview, action.payload.sow, action.payload.notes)
    console.log("willRequestReview result: ", result)

    // yield put(SowActions.willGetSow({ sow: action.payload.sow }))
    yield put(TransactionActions.didRequestReview({ sowCommand: SowCommands.REQUEST_REVIEW }))

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

  let mnemonicSecretKey = ''
  if (action.payload.saveMnemonic && action.payload.saveMnemonic.save) {
    // DECRYPT
    mnemonicSecretKey = yield call(willDecryptMnemonic, { payload: { encryptedMnemonic: action.payload.saveMnemonic.encryptedMnemonic, password: action.payload.password, salt: action.payload.saveMnemonic.salt } })
  }
  else {
    mnemonicSecretKey = action.payload.mnemonicSecretKey
  }
  console.log("willCompleteTransactionSubmitMnemonic mnemonicSecretKey: ", mnemonicSecretKey)

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: mnemonicSecretKey, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' } })
    console.log("willCompleteTransactionSubmitMnemonic resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {
      // const existingAsset = resultCheckAccountTransaction.addressInfo.createdAssets.find((asset: any) => JSON.parse(asset).params['unit-name'] === configuration[stage].submitAsset_unitName + action.payload.currentSow.sow.substring(0, 5))
      // console.log("willCompleteTransactionSubmitMnemonic existingAsset: ", existingAsset)
      let resultSignedTransaction = [] as any
      // if (existingAsset) {
      //   console.log("willCompleteTransactionSubmitMnemonic ASSET FOUND: ", JSON.parse(existingAsset))
      //   resultSignedTransaction = yield call(willDestroyAndCreateAssetMnemonic, {
      //     payload: {
      //       asset: JSON.parse(existingAsset), currentSow: action.payload.currentSow, mnemonicSecretKey: mnemonicSecretKey, params: action.payload.params.withoutDelay,
      //       addr: addr, note: note, totalIssuance: totalIssuance, decimals: decimals, defaultFrozen: defaultFrozen, manager: manager, reserve: reserve, freeze: freeze, clawback: clawback, unitName: unitName, assetName: assetName, assetURL: assetURL, assetMetadataHash: assetMetadataHash
      //     }
      //   })
      //   console.log("willCompleteTransactionSubmitMnemonic resultSignedTransaction: ", resultSignedTransaction)
      // }
      // else {
      // console.log("willCompleteTransactionSubmitMnemonic ASSET NOT FOUND")
      resultSignedTransaction = yield call(TransactionApi.signTxn,
        mnemonicSecretKey, action.payload.params.withoutDelay, addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetURL, assetMetadataHash
      )
      console.log("in willCompleteTransactionSubmitMnemonic resultSignedTransaction: ", resultSignedTransaction)
      // }

      const resultAlgorandSendTokenCreationTx = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransaction)
      console.log("willCompleteTransactionSubmitMnemonic resultAlgorandSendTokenCreationTx: ", resultAlgorandSendTokenCreationTx)

      if (resultAlgorandSendTokenCreationTx.error) {
        console.log("willCompleteTransactionSubmitMnemonic fail")
        yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: resultAlgorandSendTokenCreationTx.error, sowCommand: SowCommands.SUBMIT }))
        yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendTokenCreationTx.error, type: "danger" }));
      }
      else {
        console.log("willCompleteTransactionSubmitMnemonic success")
        yield put(TransactionActions.didCompleteTransactionSubmit({ asset: resultAlgorandSendTokenCreationTx, sowCommand: SowCommands.SUBMIT }))
      }
    }
    else {
      console.log("willCompleteTransactionSubmitMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: resultCheckAccountTransaction.error, sowCommand: SowCommands.SUBMIT }))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }
  } catch (error) {
    console.log("error in willCompleteTransactionSubmitMnemonic ", error)
    yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: error, sowCommand: SowCommands.SUBMIT }))
    yield put(NotificationActions.willShowNotification({ message: error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionSubmitMnemonic'));
}

function* willPrepareAlgoSigner(action: any) {
  console.log("in willPrepareAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willPrepareAlgoSigner'));
  const userAttributes = yield select(ProfileSelectors.getProfile)

  try {
    const resultAlgoConnect = yield call(TransactionApi.algoConnect)
    console.log("willPrepareAlgoSigner resultAlgoConnect: ", resultAlgoConnect)

    const resultAccounts = yield call(TransactionApi.algoGetAccounts)
    console.log("willPrepareAlgoSigner resultAccounts: ", resultAccounts)

    const myAccount = resultAccounts.find((account: any) => account.address === userAttributes.public_key)
    console.log("willPrepareAlgoSigner myAccount: ", myAccount)

    if (myAccount) {
      yield put(TransactionActions.didPrepareAlgoSigner({ account: myAccount }))
      switch (action.payload.sowCommand) {
        case SowCommands.SUBMIT:
          yield put(TransactionActions.goToTransactionPage({ transactionPage: 4, sowCommand: action.payload.sowCommand }))
          break;
        case SowCommands.ACCEPT_AND_PAY:
          yield put(TransactionActions.goToTransactionPage({ transactionPage: 5, sowCommand: action.payload.sowCommand }))
          break;
        case SowCommands.CLAIM_MILESTONE_MET:
          yield put(TransactionActions.goToTransactionPage({ transactionPage: 5, sowCommand: action.payload.sowCommand }))
          break;
        case SowCommands.ACCEPT_MILESTONE:
          yield put(TransactionActions.goToTransactionPage({ transactionPage: 4, sowCommand: action.payload.sowCommand }))
          break;
        default:
          yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: "Unexpted error, please retry.", sowCommand: action.payload.sowCommand }))
          break;
      }
    }
    else {
      yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: "Add your Uncommon Creative account to AlgoSigner.", sowCommand: action.payload.sowCommand }))
    }
  } catch (error) {
    console.log("error in willPrepareAlgoSigner ", error)
  }
}

function* willCompleteTransactionSubmitAlgoSigner(action: any) {
  console.log("in willCompleteTransactionSubmitAlgoSigner with: ", action)
  yield put(UIActions.startActivityRunning('willCompleteTransactionSubmitAlgoSigner'));
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
  const assetMetadataHash = hash // senza Buffer.from per AlgoSigner
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
    let resultSignedTransactions = [] as any

    // CHECK EXISTING ASSET AND DESTROOY IT
    // const existingAsset = action.payload.account['created-assets'].find((asset: any) => asset.params['unit-name'] === configuration[stage].submitAsset_unitName + action.payload.currentSow.sow.substring(0, 5))
    // console.log("willCompleteTransactionSubmitAlgoSigner existingAsset: ", existingAsset)
    // if (existingAsset) {
    //   // DUE FIRME - DESTROY AND CREATE ASSET
    //   console.log("willCompleteTransactionSubmitAlgoSigner ASSET FOUND: ", existingAsset)
    //   const resultTransactions = yield call(TransactionApi.destroyAndCreateAssetAlgoSigner,
    //     addr,
    //     note,
    //     existingAsset.index,
    //     action.payload.params.withoutDelay,
    //     totalIssuance,
    //     decimals,
    //     defaultFrozen,
    //     manager,
    //     reserve,
    //     freeze,
    //     clawback,
    //     unitName,
    //     assetName,
    //     assetURL,
    //     assetMetadataHash
    //   )

    //   const resultDestroyAssetTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions[0])
    //   console.log("willCompleteTransactionSubmitAlgoSigner resultDestroyAssetTxnSigned: ", resultDestroyAssetTxnSigned)

    //   //// DID

    //   const resultCreateAssetTxnSigned = yield call(TransactionApi.signTxAlgoSigner, resultTransactions[1])
    //   console.log("willCompleteTransactionSubmitAlgoSigner resultCreateAssetTxnSigned: ", resultCreateAssetTxnSigned)

    //   resultSignedTransactions = [resultDestroyAssetTxnSigned, resultCreateAssetTxnSigned]
    // }
    // else {
    // UNA FIRMA - CREATE ASSET
    // console.log("willCompleteTransactionSubmitAlgoSigner ASSET NOT FOUND: ", existingAsset)
    resultSignedTransactions = yield call(TransactionApi.createAssetAlgoSigner,
      addr,
      note,
      action.payload.params.withoutDelay,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash
    )
    // }
    console.log("willCompleteTransactionSubmitAlgoSigner resultSignedTransactions: ", resultSignedTransactions)

    const resultAlgorandSendTokenCreationTx = yield call(TransactionApi.algorandSendTokenCreationTx, action.payload.currentSow.sow, resultSignedTransactions)
    console.log("willCompleteTransactionSubmitAlgoSigner resultAlgorandSendTokenCreationTx: ", resultAlgorandSendTokenCreationTx)

    if (resultAlgorandSendTokenCreationTx.error) {
      console.log("willCompleteTransactionSubmitMnemonic fail")
      yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: resultAlgorandSendTokenCreationTx.error, sowCommand: SowCommands.SUBMIT }))
      yield put(NotificationActions.willShowNotification({ message: resultAlgorandSendTokenCreationTx.error, type: "danger" }));
    }
    else {
      console.log("willCompleteTransactionSubmitMnemonic success")
      yield put(TransactionActions.didCompleteTransactionSubmit({ asset: resultAlgorandSendTokenCreationTx, sowCommand: SowCommands.SUBMIT }))
    }
  } catch (error) {
    console.log("error in willCompleteTransactionSubmitAlgoSigner ", error)
    yield put(TransactionActions.didCompleteTransactionSubmitFail({ error: error.message ? error.message : error, sowCommand: SowCommands.SUBMIT }))
    yield put(NotificationActions.willShowNotification({ message: error.message ? error.message : error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning('willCompleteTransactionSubmitAlgoSigner'));
}

export function* willCheckAccountTransaction(action: any) {
  console.log("in willCheckAccountTransaction with: ", action)
  const userAttributes = yield select(ProfileSelectors.getProfile)
  const assetsCurrencies = yield select(AssetCurrencySelectors.getAssetsCurrencies)

  try {
    const resultMnemonicToSecretKey = yield call(TransactionApi.mnemonicToSecretKey, action.payload.mnemonicSecretKey)
    // console.log("willCheckAccountTransaction resultMnemonicToSecretKey: ", resultMnemonicToSecretKey)

    if (resultMnemonicToSecretKey.addr != userAttributes.public_key) {
      return {
        check: false,
        error: "The mnemonic secret key inserted doesn't match your public address."
      }
    }
    else if (action.payload.currency != 'saveMnemonic') {
      const addressInfo = yield call(willGetAlgorandAccountInfo, { payload: resultMnemonicToSecretKey.addr })
      // console.log("willCheckAccountTransaction addressInfo: ", addressInfo)
      const accountMinBalance = (addressInfo.assets.length * AlgorandMinBalance + addressInfo.createdAssets.length * AlgorandMinBalance + AlgorandMinBalance) / 1000000
      // console.log("in willCheckAccountTransaction accountMinBalance: ", accountMinBalance)
      const assetCurrencyIndex = action.payload.currency == "ALGO" ? undefined : assetsCurrencies.find((asset: any) => asset.assetName === action.payload.currency).assetIndex

      if (addressInfo.amount == 0) {
        return {
          check: false,
          error: "Your account has not the necessary balance to complete the transaction."
        }
      }
      else if ((addressInfo.amount - action.payload.toPayAlgo) < accountMinBalance) {
        return {
          check: false,
          error: `After the transaction your account would result in a balance lower than the minimum balance of ${accountMinBalance} ALGO allowed by Algorand.`
        }
      }
      else if (assetCurrencyIndex && (JSON.parse(addressInfo.assets.find((asset: any) => JSON.parse(asset)['asset-id'] === assetCurrencyIndex)).amount < action.payload.toPayAssetCurrency)) {
        return {
          check: false,
          error: `Your account has not the necessary balance of asset ${action.payload.currency} to complete the transaction.`
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
    else {
      return {
        check: true,
        error: null
      }
    }
  } catch (error) {
    console.log("error in willCheckAccountTransaction ", error)
  }
}

export function* willDestroyAndCreateAssetMnemonic(action: any) {
  console.log("in willDestroyAndCreateAssetMnemonic with: ", action)

  try {
    const resultSignedDAndCTxn = yield call(TransactionApi.destroyAndCreateAssetMnemonic,
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
    console.log("willDestroyAndCreateAssetMnemonic resultDAndCTxn: ", resultSignedDAndCTxn)

    return resultSignedDAndCTxn
  } catch (error) {
    console.log("error in willDestroyAndCreateAssetMnemonic ", error)
  }
}