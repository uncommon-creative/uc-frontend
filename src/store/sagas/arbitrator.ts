import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as ArbitratorActions } from '../slices/arbitrator'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield takeLatest(ArbitratorActions.willGetArbitrator.type, willGetArbitrator)
  yield takeLatest(ArbitratorActions.willGetArbitratorsList.type, willGetArbitratorsList)
  yield takeLatest(ArbitratorActions.willSaveArbitratorSettings.type, willSaveArbitratorSettings)
  console.log('in arbitrator saga');
}

function* willGetArbitrator() {
  console.log("in willGetArbitrator")

  try {
    const result = yield call(ArbitratorApi.getArbitrator);
    console.log("result willGetArbitrator: ", result)
    
    yield put(ArbitratorActions.didGetArbitrator(result))
  } catch (error) {
    console.log("error in willGetArbitrator ", error)
  }
}

function* willGetArbitratorsList() {
  console.log("in willGetArbitratorsList")

  try {
    const result = yield call(ArbitratorApi.getArbitratorsList);
    console.log("result willGetArbitratorsList: ", result)
    yield put(ArbitratorActions.didGetArbitratorsList(result))
  } catch (error) {
    console.log("error in willGetArbitratorsList ", error)
  }
}

function* willSaveArbitratorSettings(action: any) {
  console.log("in willSaveArbitratorSettings with ", action)
  yield put(UIActions.startActivityRunning("saveArbitratorSettings"));

  const tagsSplitted = action.payload.arbitratorSettings.tags.split(" ")
  const fee = {
    feeType: action.payload.arbitratorSettings.feeType,
    value: action.payload.arbitratorSettings.fee
  }

  try {
    const result = yield call(ArbitratorApi.addArbitrator, fee, action.payload.arbitratorSettings.currency, tagsSplitted)
    console.log("willSaveArbitratorSettings success result: ", result)
  } catch (error) {
    console.log("error in willSaveArbitratorSettings ", error)
  }
  yield put(UIActions.stopActivityRunning("saveArbitratorSettings"));
}