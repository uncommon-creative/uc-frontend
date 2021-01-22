import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as ChatApi from '../../api/chat'
import { actions as ChatActions } from '../slices/chat'

export function* sagas() {
  yield takeLatest(ChatActions.willSendTextChat.type, willSendTextChat)
  yield takeLatest(ChatActions.willSendCommandChat.type, willSendCommandChat)
  console.log('in sow saga');
}

function* willSendTextChat(action: any) {
  console.log("in willSendTextChat with: ", action)

  try {
    const result = yield call(ChatApi.sendMessageChat, action.payload.values.message, action.payload.sow, 'TEXT');
    console.log("result willSendTextChat: ", result)


  } catch (error) {
    console.log("error in willSendTextChat ", error)
  }
}

function* willSendCommandChat(action: any) {
  console.log("in willSendCommandChat with: ", action)

  try {
    const result = yield call(ChatApi.sendMessageChat, action.payload.values.message, action.payload.sow, 'TEXT');
    console.log("result willSendCommandChat: ", result)


  } catch (error) {
    console.log("error in willSendCommandChat ", error)
  }
}