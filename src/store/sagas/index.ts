import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { sagas as authSagas } from './auth'


function* runAllSagas() {
  console.log('in root saga')
  yield all([
    authSagas()
  ])
}

export default runAllSagas;