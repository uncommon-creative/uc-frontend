import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import update from 'immutability-helper';

import * as SowApi from '../../api/sow'
import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ChatActions } from '../slices/chat'
import { actions as ProfileActions } from '../slices/profile'
import { actions as UIActions } from '../slices/ui'
import * as ArbitratorApi from '../../api/arbitrator'
import { willGetUserProfile } from '../sagas/profile'

export function* sagas() {
  yield takeLatest(SowActions.willConfirmArbitrators.type, willConfirmArbitrators)
  yield takeLatest(SowActions.willCreateStatementOfWork.type, willCreateStatementOfWork)
  yield takeLatest(SowActions.willDraftStatementOfWork.type, willDraftStatementOfWork)
  yield takeLatest(SowActions.willSubmitStatementOfWork.type, willSubmitStatementOfWork)
  yield takeLatest(SowActions.willPrepareUploadAttachment.type, willPrepareUploadAttachment)
  yield takeLatest(SowActions.willDeleteAttachment.type, willDeleteAttachment)
  yield takeLatest(SowActions.willGetSowsList.type, willGetSowsList)
  yield takeLatest(SowActions.willGetSowsListSeller.type, willGetSowsListSeller)
  yield takeLatest(SowActions.willGetSowsListBuyer.type, willGetSowsListBuyer)
  yield takeLatest(SowActions.willGetSowsListArbitrator.type, willGetSowsListArbitrator)
  yield takeLatest(SowActions.willSelectSow.type, willSelectSow)
  yield takeLatest(SowActions.willGetSowAttachmentsList.type, willGetSowAttachmentsList)
  yield takeLatest(SowActions.willGetSow.type, willGetSow)
  console.log('in sow saga');
}

function* willConfirmArbitrators(action: any) {
  console.log("in willConfirmArbitrators with ", action)

  yield put(UIActions.startActivityRunning("confirmArbitrators"));

  try {
    if (Object.keys(action.payload.arbitrators).length != 0) {
      yield call(action.payload.toggle)
    }
  } catch (error) {
    console.log("error in willConfirmArbitrators ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("confirmArbitrators"));
}

function* willCreateStatementOfWork(action: any) {
  console.log("in willCreateStatementOfWork with ", action)
  // yield put(UIActions.startLoading())

  yield put(UIActions.startActivityRunning("createSow"));

  try {
    const result = yield call(SowApi.createStatementOfWork)
    console.log("willCreateStatementOfWork result: ", result)
    yield put(SowActions.didCreateStatementOfWork(result))
    yield put(push("/create-statement-of-work"))

    // yield put(UIActions.stopLoading())
  } catch (error) {
    console.log("error in willCreateStatementOfWork ", error)
    yield put(NotificationActions.willShowNotification({ message: error, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("createSow"));
}

function* willDraftStatementOfWork(action: any) {
  console.log("in willDraftStatementOfWork with: ", action)

  yield put(UIActions.startActivityRunning("draftSow"));

  const tagsParsed = action.payload.sow.tags.map((tag: any) => JSON.stringify(tag))
  const arbitratorsParsed = action.payload.sow.arbitrators.map((arb: any) => arb.user)

  try {
    const result = yield call(
      SowApi.draftStatementOfWork,
      action.payload.sow.sow,
      arbitratorsParsed,
      action.payload.sow.codeOfConduct,
      action.payload.sow.currency,
      action.payload.sow.buyer,
      action.payload.sow.deadline != '' ? action.payload.sow.deadline : undefined,
      action.payload.sow.description,
      action.payload.sow.numberReviews != '' ? action.payload.sow.numberReviews : undefined,
      action.payload.sow.price != '' ? action.payload.sow.price : undefined,
      action.payload.sow.quantity != '' ? action.payload.sow.quantity : undefined,
      tagsParsed,
      action.payload.sow.termsOfService,
      action.payload.sow.title,
      action.payload.sow.sowExpiration
    )
    console.log("willDraftStatementOfWork result: ", result)

    yield put(push("/home"))
    yield put(NotificationActions.willShowNotification({ message: "Statement of work saved", type: "success" }));
  } catch (error) {
    console.log("error in willDraftStatementOfWork ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("draftSow"));
}

function* willSubmitStatementOfWork(action: any) {
  console.log("in willSubmitStatementOfWork with: ", action)

  yield put(UIActions.startActivityRunning("submitSow"));

  const tagsParsed = action.payload.sow.tags.map((tag: any) => JSON.stringify(tag))
  const arbitratorsParsed = action.payload.sow.arbitrators.map((arb: any) => arb.user)

  try {
    const result = yield call(
      SowApi.submitStatementOfWork,
      action.payload.sow.sow,
      arbitratorsParsed,
      action.payload.sow.codeOfConduct,
      action.payload.sow.currency,
      action.payload.sow.buyer,
      action.payload.sow.deadline,
      action.payload.sow.description,
      action.payload.sow.numberReviews,
      action.payload.sow.price,
      action.payload.sow.quantity,
      tagsParsed,
      action.payload.sow.termsOfService,
      action.payload.sow.title,
      action.payload.sow.sowExpiration
    )
    console.log("willSubmitStatementOfWork result: ", result)

    yield call(willGetUserProfile, { user: result.buyer })
    yield put(SowActions.didSubmitStatementOfWork(result))
    yield put(push("/home"))
    yield put(NotificationActions.willShowNotification({ message: "Statement of work created", type: "success" }));
  } catch (error) {
    console.log("error in willSubmitStatementOfWork ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("submitSow"));
}

function* willPrepareUploadAttachment(action: any) {
  console.log("in willPrepareUploadAttachment with: ", action)

  let tmpFileList = [] as any
  let tmpAttachment = {} as any
  const key = action.payload.sow.status == SowStatus.DRAFT ?
    action.payload.sow.sow + '/' + action.payload.attachment.name
    : action.payload.sow.sow + '/' + action.payload.username + '/' + action.payload.attachment.name
  const owner = action.payload.sow.status == SowStatus.DRAFT ?
    action.payload.sow.sow
    : action.payload.username

  yield put(UIActions.startActivityRunning(key));

  tmpAttachment = {
    'sow': action.payload.sow.sow,
    'owner': owner,
    'filename': action.payload.attachment.name,
    'key': key,
    'size': action.payload.attachment.size,
    'type': action.payload.attachment.type
  }
  const index = action.payload.newAttachments.findIndex((e: any) => e.key === tmpAttachment.key);
  console.log("index: ", index)

  if (index === -1) {
    tmpFileList = action.payload.newAttachments.concat([tmpAttachment])
  } else {
    tmpFileList = action.payload.newAttachments.concat([tmpAttachment])
    tmpFileList.splice(index, 1);
  }
  console.log("tmpFileList: ", tmpFileList)

  yield put(SowActions.didPrepareUploadAttachment(tmpFileList))

  try {
    const result = yield call(SowApi.getUploadUrl, action.payload.sow.sow, key, 600, action.payload.attachment.type)
    console.log("in willPrepareUploadAttachment with result: ", result)

    console.log("AAA: ", action.payload.attachment)
    yield call(SowApi.uploadFileToS3, result, action.payload.attachment)
    yield put(ChatActions.willSendAttachmentChat({ values: { key: key, size: action.payload.attachment.size, type: action.payload.attachment.type }, sow: action.payload.sow }))
    yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow.sow } });
  } catch (error) {
    console.log("error in willPrepareUploadAttachment ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning(key));
}

function* willDeleteAttachment(action: any) {
  console.log("in willDeleteAttachment with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.attachment.key));

  const fileToDelete =
    action.payload.attachment.owner == action.payload.attachment.sow ? action.payload.attachment.sow + '/' + action.payload.attachment.filename
      : action.payload.attachment.sow + '/' + action.payload.attachment.owner + '/' + action.payload.attachment.filename

  try {
    yield call(SowApi.deleteAttachment, fileToDelete, action.payload.sow.sow)
    yield put(NotificationActions.willShowNotification({ message: action.payload.attachment.key + " deleted", type: "success" }));
    yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow.sow } });
  } catch (error) {
    console.log("error in willDeleteAttachment ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning(action.payload.attachment.key));
}

function* willGetSowsList() {
  console.log("in willGetSowsList")
  yield put(UIActions.startActivityRunning("getSowsList"));
  try {
    yield call(willGetSowsListSeller)
    yield call(willGetSowsListBuyer)
    yield call(willGetSowsListArbitrator)
  } catch (error) {
    console.log("error in willGetSowsList ", error)
  }
  yield put(UIActions.stopActivityRunning("getSowsList"));
}

function* willGetSowsListSeller() {
  console.log("in willGetSowsListSeller")
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(SowApi.getSowsListSeller);
    console.log("result willGetSowsListSeller: ", result)
    for (const sow of result.sows) {
      yield call(willGetUserProfile, { user: sow.seller })
      sow.buyer != 'not_set' && (yield call(willGetUserProfile, { user: sow.buyer }))
    }
    yield put(SowActions.didGetSowsListSeller(result))

    const totalUnreadMessagesSeller = result.sows.reduce((a: any, b: any) => {
      return a + b['messagesToReadSeller']
    }, 0)

    yield put(ChatActions.didCountUnreadMessagesSeller(totalUnreadMessagesSeller))

    // yield put(UIActions.stopLoading())

  } catch (error) {
    console.log("error in willGetSowsListSeller ", error)
  }
}

function* willGetSowsListBuyer() {
  console.log("in willGetSowsListBuyer")
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(SowApi.getSowsListBuyer);
    console.log("result willGetSowsListBuyer: ", result)
    for (const sow of result.sows) {
      yield call(willGetUserProfile, { user: sow.seller })
      sow.buyer != 'not_set' && (yield call(willGetUserProfile, { user: sow.buyer }))
    }
    yield put(SowActions.didGetSowsListBuyer(result))

    const totalUnreadMessagesBuyer = result.sows.reduce((a: any, b: any) => {
      return a + b['messagesToReadBuyer']
    }, 0)

    yield put(ChatActions.didCountUnreadMessagesBuyer(totalUnreadMessagesBuyer))

    // yield put(UIActions.stopLoading())

  } catch (error) {
    console.log("error in willGetSowsListBuyer ", error)
  }
}

function* willGetSowsListArbitrator() {
  console.log("in willGetSowsListArbitrator")
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(SowApi.getSowsListArbitrator);
    console.log("result willGetSowsListArbitrator: ", result)
    for (const sow of result.sows) {
      yield call(willGetUserProfile, { user: sow.seller })
      yield call(willGetUserProfile, { user: sow.buyer })
    }
    yield put(SowActions.didGetSowsListArbitrator(result))

    const totalUnreadMessagesArbitrator = result.sows.reduce((a: any, b: any) => {
      return a + b['messagesToReadArbitrator']
    }, 0)

    yield put(ChatActions.didCountUnreadMessagesArbitrator(totalUnreadMessagesArbitrator))

    // yield put(UIActions.stopLoading())

  } catch (error) {
    console.log("error in willGetSowsListArbitrator ", error)
  }
}

function* willSelectSow(action: any) {
  console.log("in willSelectSow with: ", action)
  const fullArbitrators = []

  if (Array.isArray(action.payload.sow.arbitrators)) {
    for (const arb of action.payload.sow.arbitrators) {
      fullArbitrators.push(yield call(ArbitratorApi.getArbitrator, arb))
    }
  }
  console.log("in willSelectSow with fullArbitrators: ", fullArbitrators)
  yield put(SowActions.willConfirmArbitrators({ arbitrators: fullArbitrators, toggle: () => { } }))

  yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow.sow } });

  if (action.payload.sow.status == "DRAFT") {
    action.payload.history.push('/create-statement-of-work')
  }
  else {
    action.payload.history.push('/statement-of-work/' + action.payload.sow.sow)
  }
}

function* willGetSowAttachmentsList(action: any) {
  console.log("in willGetSowAttachmentsList with: ", action)

  try {
    const result = yield call(SowApi.getSowAttachmentsList, action.payload.sow);
    console.log("result willGetSowAttachmentsList: ", result)
    const attachmentsSplitted = [] as any
    for (const attachment of result) {
      let tmp = attachment.key.split('/')
      const downloadUrl = yield call(SowApi.getDownloadUrl, tmp[0], attachment.key, 600)
      attachmentsSplitted.push(
        {
          'sow': tmp[0],
          'owner': tmp[2] ? tmp[1] : tmp[0],
          'filename': tmp[2] ? tmp[2] : tmp[1],
          'key': attachment.key,
          'downloadUrl': downloadUrl,
          'size': attachment.size,
          'type': attachment.type
        }
      )
    }
    console.log("attachmentsSplitted: ", attachmentsSplitted)
    yield put(SowActions.didGetSowAttachmentsList(attachmentsSplitted))

  } catch (error) {
    console.log("error in willGetSowAttachmentsList ", error)
  }
}

function* willGetSow(action: any) {
  console.log("in willGetSow with: ", action)
  yield put(UIActions.startActivityRunning("getSow"));
  // yield put(UIActions.startLoading())

  try {
    const result = yield call(SowApi.getSow, action.payload.sow);
    console.log("result willGetSow: ", result)
    yield call(willGetUserProfile, { user: result.seller })
    yield call(willGetUserProfile, { user: result.buyer })
    yield put(SowActions.didGetSow(result))
    yield put(ChatActions.willReadSowChat(action.payload))
    yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow } });

    const fullArbitrators = []
    if (Array.isArray(result.arbitrators)) {
      for (const arb of result.arbitrators) {
        fullArbitrators.push(yield call(ArbitratorApi.getArbitrator, arb))
      }
    }
    console.log("in willGetSow with fullArbitrators: ", fullArbitrators)
    yield put(SowActions.willConfirmArbitrators({ arbitrators: fullArbitrators, toggle: () => { } }))

    // yield put(UIActions.stopLoading())
  } catch (error) {
    console.log("error in willGetSow ", error)
  }
  yield put(UIActions.stopActivityRunning("getSow"));
}