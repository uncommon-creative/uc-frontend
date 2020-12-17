import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { sagas as authSagas } from './auth'
import { sagas as notificationSagas } from './notification'
import { sagas as profileSagas } from './profile'


function* runAllSagas() {
  console.log('in root saga')
  yield all([
    authSagas(),
    notificationSagas(),
    profileSagas()
  ])
}

export default runAllSagas;