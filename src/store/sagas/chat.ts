import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import update from 'immutability-helper';

import * as ChatApi from '../../api/chat'
import { actions as ChatActions, selectors as ChatSelectors } from '../slices/chat'
import { actions as SowActions } from '../slices/sow'
import { actions as UIActions } from '../slices/ui'
import * as SowApi from '../../api/sow'

export function* sagas() {
  yield takeLatest(ChatActions.willRefreshSowChat.type, willRefreshSowChat)
  yield takeLatest(ChatActions.willReadSowChat.type, willReadSowChat)
  yield takeLatest(ChatActions.willSendTextChat.type, willSendTextChat)
  yield takeLatest(ChatActions.willSendCommandChat.type, willSendCommandChat)
  yield takeLatest(ChatActions.willSendAttachmentChat.type, willSendAttachmentChat)
  console.log('in sow saga');
}

function* willRefreshSowChat(action: any) {
  console.log("in willRefreshSowChat with: ", action)
  const messages = yield select(ChatSelectors.getMessages)

  try {
    const lastTimestamp = messages.length ? messages[messages.length - 1].createdAt : null
    const result = yield call(ChatApi.listSowChatMessages, action.payload.sow, lastTimestamp);
    console.log("result willRefreshSowChat: ", result)

    yield put(ChatActions.didRefreshSowChat(result.messages))
  } catch (error) {
    console.log("error in willRefreshSowChat ", error)
  }
}

function* willReadSowChat(action: any) {
  console.log("in willReadSowChat with: ", action)

  try {
    var result = yield call(ChatApi.listSowChatMessages, action.payload.sow, null);
    console.log("result willReadSowChat: ", result)

    for (var msg of result.messages) {
      if (msg.attachmentMessage) {
        let tmp = msg.attachmentMessage.key.split('/')
        const downloadUrl = yield call(SowApi.getDownloadUrl, tmp[0], msg.attachmentMessage.key, 600)

        msg.attachmentMessage['downloadUrl'] = downloadUrl
      }
    }

    yield put(ChatActions.didReadSowChat(result.messages))
  } catch (error) {
    console.log("error in willReadSowChat ", error)
  }
}

function* willSendTextChat(action: any) {
  console.log("in willSendTextChat with: ", action)
  yield put(UIActions.startActivityRunning('sendMessageChat'));
  const messages = yield select(ChatSelectors.getMessages)

  try {
    const result = yield call(ChatApi.sendTextChat, action.payload.values.message, action.payload.sow.sow, 'TEXT');
    console.log("result willSendTextChat: ", result)

    // yield call(willReadSowChat, { payload: action.payload })
    yield call(willRefreshSowChat, { payload: { messages: messages, sow: action.payload.sow.sow } })
    yield put(ChatActions.didSendTextChat(result))

    // yield put(SowActions.willGetSow({ sow: action.payload.sow.sow }))
  } catch (error) {
    console.log("error in willSendTextChat ", error)
  }
  yield put(UIActions.stopActivityRunning('sendMessageChat'));
}

function* willSendCommandChat(action: any) {
  console.log("in willSendCommandChat with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.values.command));
  const messages = yield select(ChatSelectors.getMessages)

  try {
    const result = yield call(ChatApi.sendCommandChat, action.payload.values.command, action.payload.sow.sow, 'COMMAND');
    console.log("result willSendCommandChat: ", result)

    yield call(willRefreshSowChat, { payload: { messages: messages, sow: action.payload.sow.sow } })

    yield put(SowActions.willGetSow({ sow: action.payload.sow.sow }))
  } catch (error) {
    console.log("error in willSendCommandChat ", error)
  }
  yield put(UIActions.stopActivityRunning(action.payload.values.command));
}

function* willSendAttachmentChat(action: any) {
  console.log("in willSendAttachmentChat with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.values.key));
  const messages = yield select(ChatSelectors.getMessages)

  try {
    const result = yield call(ChatApi.sendAttachmentChat, { key: action.payload.values.key, size: action.payload.values.size, type: action.payload.values.type }, action.payload.sow.sow, 'ATTACHMENT');
    console.log("result willSendAttachmentChat: ", result)

    yield call(willRefreshSowChat, { payload: { messages: messages, sow: action.payload.sow.sow } })

    yield put(SowActions.willGetSow({ sow: action.payload.sow.sow }))
  } catch (error) {
    console.log("error in willSendAttachmentChat ", error)
  }
  yield put(UIActions.stopActivityRunning(action.payload.values.key));
}