import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../slices/assetCurrency'
import { willGetAlgorandAccountInfo } from '../sagas/transaction'

export function* sagas() {
  yield takeLatest(AssetCurrencyActions.willGoToAssetCurrencyPage.type, willGoToAssetCurrencyPage)
  yield takeLatest(AssetCurrencyActions.willSelectAssetCurrency.type, willSelectAssetCurrency)
  console.log('in assetCurrency saga');
}

export function* willGoToAssetCurrencyPage(action: any) {
  console.log("in willGoToAssetCurrencyPage with: ", action)

  try {
    yield call(willGetAlgorandAccountInfo, { payload: action.payload.user })

    action.payload.history.push('/optin-assets')
  } catch (error) {
    console.log("error in willGoToAssetCurrencyPage ", error)
  }
}

export function* willSelectAssetCurrency(action: any) {
  console.log("in willSelectAssetCurrency with: ", action)

  try {

    yield put(AssetCurrencyActions.didSelectAssetCurrency(action.payload.asset))

  } catch (error) {
    console.log("error in willSelectAssetCurrency ", error)
  }
}