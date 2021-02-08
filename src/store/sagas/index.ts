import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { sagas as authSagas } from './auth'
import { sagas as notificationSagas } from './notification'
import { sagas as profileSagas } from './profile'
import { sagas as sowSagas } from './sow'
import { sagas as arbitratorSagas } from './arbitrator'
import { sagas as chatSagas } from './chat'
import { sagas as transactionSagas } from './transaction'

function* runAllSagas() {
  console.log('in root saga')
  yield all([
    authSagas(),
    notificationSagas(),
    profileSagas(),
    sowSagas(),
    arbitratorSagas(),
    chatSagas(),
    transactionSagas()
  ])
}

export default runAllSagas;