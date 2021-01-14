import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as ArbitratorApi from '../../api/arbitrator'
import { actions as ArbitratorActions } from '../slices/arbitrator'
import { actions as NotificationActions } from '../slices/notification'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield takeLatest(ArbitratorActions.willGetArbitratorsList.type, willGetArbitratorsList)
  console.log('in arbitrator saga');
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