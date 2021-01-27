import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import * as SowApi from '../../api/sow'
import { actions as SowActions } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ChatActions } from '../slices/chat'
import { actions as UIActions } from '../slices/ui'
import * as ArbitratorApi from '../../api/arbitrator'

export function* sagas() {
  yield takeLatest(SowActions.willConfirmArbitrators.type, willConfirmArbitrators)
  yield takeLatest(SowActions.willCreateStatementOfWork.type, willCreateStatementOfWork)
  yield takeLatest(SowActions.willDraftStatementOfWork.type, willDraftStatementOfWork)
  yield takeLatest(SowActions.willSubmitStatementOfWork.type, willSubmitStatementOfWork)
  yield takeLatest(SowActions.willUploadAttachment.type, willUploadAttachment)
  yield takeLatest(SowActions.willDeleteAttachment.type, willDeleteAttachment)
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

  yield put(UIActions.startActivityRunning("createSow"));

  try {
    const result = yield call(SowApi.createStatementOfWork)
    console.log("willCreateStatementOfWork result: ", result)
    yield put(SowActions.didCreateStatementOfWork(result))
    yield put(push("/create-statement-of-work"))
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
      action.payload.sow.title)
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
      action.payload.sow.title
    )
    console.log("willSubmitStatementOfWork result: ", result)

    yield put(SowActions.didSubmitStatementOfWork(result))
    yield put(push("/home"))
    yield put(NotificationActions.willShowNotification({ message: "Statement of work created", type: "success" }));
  } catch (error) {
    console.log("error in willSubmitStatementOfWork ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning("submitSow"));
}

function* willUploadAttachment(action: any) {
  console.log("in willUploadAttachment with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.attachment.name));

  try {
    const result = yield call(SowApi.getUploadUrl, action.payload.sow, action.payload.attachment.name, 600, action.payload.attachment.type)
    console.log("in willUploadAttachment with result: ", result)

    yield call(SowApi.uploadFileToS3, result, action.payload.attachment)
  } catch (error) {
    console.log("error in willUploadAttachment ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning(action.payload.attachment.name));
}

function* willDeleteAttachment(action: any) {
  console.log("in willDeleteAttachment with: ", action)
  yield put(UIActions.startActivityRunning(action.payload.attachment.name));

  try {
    yield call(SowApi.deleteAttachment, action.payload.attachment.name, action.payload.sow)
    yield put(NotificationActions.willShowNotification({ message: action.payload.attachment.name + " deleted", type: "success" }));
  } catch (error) {
    console.log("error in willDeleteAttachment ", error)
    yield put(NotificationActions.willShowNotification({ message: error.message, type: "danger" }));
  }
  yield put(UIActions.stopActivityRunning(action.payload.attachment.name));
}

function* willGetSowsListSeller() {
  console.log("in willGetSowsListSeller")

  try {
    const result = yield call(SowApi.getSowsListSeller);
    console.log("result willGetSowsListSeller: ", result)
    yield put(SowActions.didGetSowsListSeller(result))
  } catch (error) {
    console.log("error in willGetSowsListSeller ", error)
  }
}

function* willGetSowsListBuyer() {
  console.log("in willGetSowsListBuyer")

  try {
    const result = yield call(SowApi.getSowsListBuyer);
    console.log("result willGetSowsListBuyer: ", result)
    yield put(SowActions.didGetSowsListBuyer(result))

  } catch (error) {
    console.log("error in willGetSowsListBuyer ", error)
  }
}

function* willGetSowsListArbitrator() {
  console.log("in willGetSowsListArbitrator")

  try {
    const result = yield call(SowApi.getSowsListArbitrator);
    console.log("result willGetSowsListArbitrator: ", result)
    yield put(SowActions.didGetSowsListArbitrator(result))

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


  let attachments = yield call(SowApi.getSowAttachmentsList, action.payload.sow.sow);
  attachments = attachments.map((attachment: any) => attachment.key.split('/'))
  yield put(SowActions.didGetSowAttachmentsList(attachments))

  if (action.payload.sow.status == "DRAFT") {
    console.log("sow DRAFT")
    action.payload.history.push('/create-statement-of-work')
  }
  else/*  if (action.payload.sow.status == "SUBMITTED") */ {
    console.log("sow SUBMITTED")

    // yield put(ChatActions.willReadSowChat, action.payload.sow.sow)
    
    action.payload.history.push('/statement-of-work')
  }
}

function* willGetSowAttachmentsList(action: any) {
  console.log("in willGetSowAttachmentsList with: ", action)

  try {
    const result = yield call(SowApi.getSowAttachmentsList, action.payload.sow);
    console.log("result willGetSowAttachmentsList: ", result)
    yield put(SowActions.didGetSowAttachmentsList(result))

  } catch (error) {
    console.log("error in willGetSowAttachmentsList ", error)
  }
}

function* willGetSow(action: any) {
  console.log("in willGetSow with: ", action)

  try {
    const result = yield call(SowApi.getSow, action.payload.sow);
    console.log("result willGetSow: ", result)
    yield put(SowActions.didGetSow(result))

  } catch (error) {
    console.log("error in willGetSow ", error)
  }
}