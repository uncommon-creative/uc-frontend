import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import * as AuthApi from '../../api/auth'

export function* sagas() {
  yield call(test, {});
  console.log('in auth saga');
}

function* test(action: any) {
  console.log('in test function');
  AuthApi.configure();
  console.log('after configure');
}
