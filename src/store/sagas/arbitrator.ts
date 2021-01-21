import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../slices/arbitrator'
import { selectors as ProfileSelectors } from '../slices/profile'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield takeLatest(ArbitratorActions.willGetArbitrator.type, willGetArbitrator)
  yield takeLatest(ArbitratorActions.willGetArbitratorsList.type, willGetArbitratorsList)
  yield takeLatest(ArbitratorActions.willGetFullArbitratorsList.type, willGetFullArbitratorsList)
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

function* willGetFullArbitratorsList() {
  console.log("in willGetFullArbitratorsList")

  try {
    const result = yield call(ArbitratorApi.getFullArbitratorsList);
    console.log("result willGetFullArbitratorsList: ", result)
    yield put(ArbitratorActions.didGetArbitratorsList(result))
  } catch (error) {
    console.log("error in willGetFullArbitratorsList ", error)
  }
}

function* willSaveArbitratorSettings(action: any) {
  console.log("in willSaveArbitratorSettings with ", action)
  yield put(UIActions.startActivityRunning("saveArbitratorSettings"));

  const profile = yield select(ProfileSelectors.getProfile)
  const myArbitratorSettings = yield select(ArbitratorSelectors.getMyArbitratorSettings)

  const tagsParsed = action.payload.arbitratorSettings.tags.map((tag: any) => JSON.stringify(tag))
  const fee = {
    flat: action.payload.arbitratorSettings.feeFlat,
    perc: action.payload.arbitratorSettings.feePercentage
  }

  try {
    if (myArbitratorSettings && profile.email === myArbitratorSettings.email) {
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
  yield put(UIActions.stopActivityRunning("saveArbitratorSettings"));
}