import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as ChatApi from '../../api/chat'
import { actions as ChatActions } from '../slices/chat'
import { actions as SowActions } from '../slices/sow'
import { actions as UIActions } from '../slices/ui'

export function* sagas() {
  yield takeLatest(SowActions.willSelectSow.type, willReadSowChat)
  yield takeLatest(ChatActions.willSendTextChat.type, willSendTextChat)
  yield takeLatest(ChatActions.willSendCommandChat.type, willSendCommandChat)
  yield takeLatest(ChatActions.willSendAttachmentChat.type, willSendAttachmentChat)
  console.log('in sow saga');
}

function* willReadSowChat(action: any) {
  console.log("in willReadSowChat with: ", action)

  try {
    const result = yield call(ChatApi.listSowChatMessages, action.payload.sow.sow);
    console.log("result willReadSowChat: ", result)

    yield put(ChatActions.didReadSowChat(result.messages))
  } catch (error) {
    console.log("error in willReadSowChat ", error)
  }
}

function* willSendTextChat(action: any) {
  console.log("in willSendTextChat with: ", action)

  try {
    const result = yield call(ChatApi.sendTextChat, action.payload.values.message, action.payload.sow.sow, 'TEXT');
    console.log("result willSendTextChat: ", result)

    yield call(willReadSowChat, { payload: action.payload })
    yield put(ChatActions.didSendTextChat(result))

  } catch (error) {
    console.log("error in willSendTextChat ", error)
  }
}

function* willSendCommandChat(action: any) {
  console.log("in willSendCommandChat with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.values.command));

  try {
    const result = yield call(ChatApi.sendCommandChat, action.payload.values.command, action.payload.sow.sow, 'COMMAND');
    console.log("result willSendCommandChat: ", result)

    yield call(willReadSowChat, { payload: action.payload })

    yield put(SowActions.willGetSow({ sow: action.payload.sow.sow }))
  } catch (error) {
    console.log("error in willSendCommandChat ", error)
  }
  yield put(UIActions.stopActivityRunning(action.payload.values.command));
}

function* willSendAttachmentChat(action: any) {
  console.log("in willSendAttachmentChat with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.values.key));

  try {
    const result = yield call(ChatApi.sendAttachmentChat, action.payload.values.key, action.payload.sow.sow, 'ATTACHMENT');
    console.log("result willSendAttachmentChat: ", result)

    yield call(willReadSowChat, { payload: action.payload })

    yield put(SowActions.willGetSow({ sow: action.payload.sow.sow }))
  } catch (error) {
    console.log("error in willSendAttachmentChat ", error)
  }
  yield put(UIActions.stopActivityRunning(action.payload.values.key));
}