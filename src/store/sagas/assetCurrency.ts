import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../slices/assetCurrency'
import { willGetAlgorandAccountInfo } from '../sagas/transaction'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'
// import * as TransactionApi from '../../api/transaction'
import * as AssetCurrencyApi from '../../api/assetCurrency'
import { willCheckAccountTransaction } from './transaction'

export function* sagas() {
  yield takeLatest(AssetCurrencyActions.willGoToAssetCurrencyPage.type, willGoToAssetCurrencyPage)
  yield takeLatest(AssetCurrencyActions.willSelectAssetCurrency.type, willSelectAssetCurrency)
  yield takeLatest(AssetCurrencyActions.willOptinAssetCurrency.type, willOptinAssetCurrency)
  yield takeLatest(AssetCurrencyActions.willDispenseAssetCurrency.type, willDispenseAssetCurrency)
  console.log('in assetCurrency saga');
}

export function* willGoToAssetCurrencyPage(action: any) {
  console.log("in willGoToAssetCurrencyPage with: ", action)

  try {
    action.payload.history.push('/optin-assets')
  } catch (error) {
    console.log("error in willGoToAssetCurrencyPage ", error)
  }
}

export function* willSelectAssetCurrency(action: any) {
  console.log("in willSelectAssetCurrency with: ", action)
  yield put(UIActions.startActivityRunning("willSelectAssetCurrency"));

  try {
    yield put(AssetCurrencyActions.toggleModalOpen())
    yield put(AssetCurrencyActions.didSelectAssetCurrency(action.payload.asset))

  } catch (error) {
    console.log("error in willSelectAssetCurrency ", error)
  }
  yield put(UIActions.stopActivityRunning("willSelectAssetCurrency"));
}

export function* willOptinAssetCurrency(action: any) {
  console.log("in willOptinAssetCurrency with: ", action)
  yield put(UIActions.startActivityRunning("willOptinAssetCurrency"));

  try {
    const resultCheckAccountTransaction = yield call(willCheckAccountTransaction, { payload: { mnemonicSecretKey: action.payload.mnemonicSecretKey, toPay: action.payload.toPay } })
    console.log("willOptinAssetCurrency resultCheckAccountTransaction: ", resultCheckAccountTransaction)

    if (resultCheckAccountTransaction.check) {

      let resultSignedOptin = [] as any
      resultSignedOptin = yield call(AssetCurrencyApi.signOptinAssetCurrencyMnemonic, action.payload.params.withoutDelay, action.payload.mnemonicSecretKey, action.payload.address, action.payload.assetId)
      console.log("willOptinAssetCurrency resultSignedOptin: ", resultSignedOptin)

      const resultSentOptin = yield call(AssetCurrencyApi.algorandSendRawTx, resultSignedOptin)
      console.log("willOptinAssetCurrency resultSentOptin: ", resultSentOptin)

      if (resultSentOptin.error) {
        console.log("willOptinAssetCurrency resultSentOptin fail: ", resultSentOptin)
        yield put(AssetCurrencyActions.didOptinAssetCurrencyFail({ error: resultSentOptin.error }))
        yield put(NotificationActions.willShowNotification({ message: resultSentOptin.error, type: "danger" }));
      }
      else {
        console.log("willOptinAssetCurrency resultSentOptin success: ", resultSentOptin)
        yield put(AssetCurrencyActions.didOptinAssetCurrency({ tx: resultSentOptin }))
      }
    }
    else {
      console.log("willOptinAssetCurrency fail")
      yield put(AssetCurrencyActions.didOptinAssetCurrencyFail({ error: resultCheckAccountTransaction.error }))
      yield put(NotificationActions.willShowNotification({ message: resultCheckAccountTransaction.error, type: "danger" }));
    }

  } catch (error) {
    console.log("error in willOptinAssetCurrency ", error)
  }
  yield put(UIActions.stopActivityRunning("willOptinAssetCurrency"));
}

export function* willDispenseAssetCurrency(action: any) {
  console.log("in willDispenseAssetCurrency with: ", action)
  yield put(UIActions.startActivityRunning("willDispenseAssetCurrency"));

  try {
    const resultDispense = yield call(AssetCurrencyApi.algorandDispenseFakeAsset, action.payload.address, action.payload.asset.fakeAssetEnum)
    console.log("willOptinAssetCurrency resultDispense: ", resultDispense)

  } catch (error) {
    console.log("error in willDispenseAssetCurrency ", error)
  }
  yield put(UIActions.stopActivityRunning("willDispenseAssetCurrency"));
}