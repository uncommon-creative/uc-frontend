import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../slices/arbitrator'
import { selectors as ProfileSelectors } from '../slices/profile'
import { selectors as AuthSelectors } from '../slices/auth'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'
import { willGetUserProfile } from '../sagas/profile'

export function* sagas() {
  yield takeLatest(ArbitratorActions.willGetArbitrator.type, willGetArbitrator)
  yield takeLatest(ArbitratorActions.willGetArbitratorsList.type, willGetArbitratorsList)
  yield takeLatest(ArbitratorActions.willGetFullArbitratorsList.type, willGetFullArbitratorsList)
  yield takeLatest(ArbitratorActions.willSaveArbitratorSettings.type, willSaveArbitratorSettings)
  yield takeLatest(ArbitratorActions.willViewCurrentArbitrator.type, willViewCurrentArbitrator)
  console.log('in arbitrator saga');
}

export function* willGetArbitrator(action: any) {
  console.log("in willGetArbitrator with: ", action)

  try {
    const result = yield call(ArbitratorApi.getArbitrator, action.payload.user);
    console.log("result willGetArbitrator: ", result)

    yield put(ArbitratorActions.didGetArbitrator(result))

    return result
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

function* willGetFullArbitratorsList() {
  console.log("in willGetFullArbitratorsList")
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(ArbitratorApi.getFullArbitratorsList);
    console.log("result willGetFullArbitratorsList: ", result)
    yield put(ArbitratorActions.didGetFullArbitratorsList(result))

    // yield put(UIActions.stopLoading())
  } catch (error) {
    console.log("error in willGetFullArbitratorsList ", error)
  }
}

function* willSaveArbitratorSettings(action: any) {
  console.log("in willSaveArbitratorSettings with ", action)
  yield put(UIActions.startActivityRunning("submitProfile"));

  const myArbitratorSettings = yield select(ArbitratorSelectors.getMyArbitratorSettings)
  const user = yield select(AuthSelectors.getUser)

  const tagsParsed = action.payload.arbitratorSettings.tags.map((tag: any) => JSON.stringify(tag))
  const fee = {
    flat: action.payload.arbitratorSettings.feeFlat != '' ? action.payload.arbitratorSettings.feeFlat : 0,
    perc: action.payload.arbitratorSettings.feePercentage != '' ? action.payload.arbitratorSettings.feePercentage : 0
  }

  try {
    if (myArbitratorSettings && user.username === myArbitratorSettings.user) {
      const result = yield call(ArbitratorApi.updateArbitrator, action.payload.arbitratorSettings.enabled, fee, action.payload.arbitratorSettings.currency, tagsParsed)
      console.log("update arbitrator success result: ", result)
    }
    else {
      const result = yield call(ArbitratorApi.addArbitrator, fee, action.payload.arbitratorSettings.currency, tagsParsed)
      console.log("add arbitrator success result: ", result)
    }
    yield put(NotificationActions.willShowNotification({ message: "Arbitrator settings saved", type: "success" }));
  } catch (error) {
    console.log("error in willSaveArbitratorSettings ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("submitProfile"));
}

function* willViewCurrentArbitrator(action: any) {
  console.log("in willViewCurrentArbitrator with ", action)

  try {
    yield call(willGetUserProfile, { user: action.payload.user })

    yield put(ArbitratorActions.didViewCurrentArbitrator(action.payload))
  } catch (error) {
    console.log("error in willViewCurrentArbitrator ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
}