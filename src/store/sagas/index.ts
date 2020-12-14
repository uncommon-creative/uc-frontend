import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { sagas as authSagas } from './auth'
import { sagas as notificationSagas } from './notification'


function* runAllSagas() {
  console.log('in root saga')
  yield all([
    authSagas(),
    notificationSagas()
  ])
}

export default runAllSagas;