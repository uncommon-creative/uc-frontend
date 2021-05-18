import { call, put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import update from 'immutability-helper';

import * as SowApi from '../../api/sow'
import { actions as SowActions, SowStatus, SowCommands } from '../slices/sow'
import { actions as NotificationActions } from '../slices/notification'
import { actions as ChatActions } from '../slices/chat'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../slices/profile'
import { actions as TransactionActions } from '../slices/transaction'
import { actions as ArbitratorActions, selectors as ArbitratorsSelectors } from '../slices/arbitrator'
import { actions as UIActions } from '../slices/ui'
import * as ArbitratorApi from '../../api/arbitrator'
import * as TransactionApi from '../../api/transaction'
import { willGetUserProfile } from '../sagas/profile'
import { configuration } from '../../config'

import { willGetParams } from './transaction'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

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
  yield takeLatest(SowActions.willBuildHtml.type, willBuildHtml)
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
      action.payload.sow.arbitrator.user,
      // arbitratorsParsed,
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
      action.payload.sow.sowExpiration,
      action.payload.sow.licenseTermsOption,
      action.payload.sow.licenseTermsNotes
    )
    console.log("willDraftStatementOfWork result: ", result)

    // yield put(push("/home"))
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

  const userAttributes = yield select(ProfileSelectors.getProfile)
  console.log("in willSubmitStatementOfWork userAttributes: ", userAttributes)
  const tagsParsed = action.payload.sow.tags.map((tag: any) => JSON.stringify(tag))
  const arbitratorsParsed = action.payload.sow.arbitrators.map((arb: any) => arb.user)

  try {
    if (userAttributes.address) {
      const resultDraft = yield call(
        SowApi.draftStatementOfWork, // submitStatementOfWork
        action.payload.sow.sow,
        action.payload.sow.arbitrator.user,
        // arbitratorsParsed,
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
        action.payload.sow.sowExpiration,
        action.payload.sow.licenseTermsOption,
        action.payload.sow.licenseTermsNotes
      )
      console.log("willSubmitStatementOfWork resultDraft: ", resultDraft)

      const userSeller = yield call(willGetUserProfile, { user: resultDraft.seller })
      // console.log("willSubmitStatementOfWork userSeller: ", userSeller)
      const userBuyer = yield call(willGetUserProfile, { user: resultDraft.buyer })
      // console.log("willSubmitStatementOfWork userBuyer: ", userBuyer)

      // NOT REGISTERED
      if (!userBuyer.email) {
        yield put(NotificationActions.willShowNotification({ message: "The buyer has to sign up to Uncommon Creative in order to proceed with the submission", type: "danger" }));
        action.payload.history.push('/statement-of-work/' + resultDraft.sow)
      }
      // PROFILE NOT COMPLETED
      else if (!userBuyer.address) {
        yield put(NotificationActions.willShowNotification({ message: "The buyer has to complete his profile on Uncommon Creative in order to proceed with the submission", type: "danger" }));
        action.payload.history.push('/statement-of-work/' + resultDraft.sow)
      }
      else {
        yield put(SowActions.didSubmitStatementOfWork(resultDraft))

        yield call(willBuildPdf, { payload: { sow: resultDraft.sow } })
        yield put(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.SUBMIT }))
      }
    }
    else {
      yield call(willDraftStatementOfWork, action)
      yield put(push("/profile"))
      yield put(NotificationActions.willShowNotification({ message: "Please complete your profile before submit.", type: "info" }));
    }
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
  const key =
    action.payload.keyAttachment ? action.payload.sow.sow + '/' + action.payload.keyAttachment
      : action.payload.sow.sow + '/' + action.payload.username + '/' + action.payload.attachment.name
  const owner = action.payload.keyAttachment ? action.payload.sow.sow : action.payload.username

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

    yield call(SowApi.uploadFileToS3, result, action.payload.attachment)
    !(action.payload.keyAttachment) && (yield put(ChatActions.willSendAttachmentChat({ values: { key: key, size: action.payload.attachment.size, type: action.payload.attachment.type }, sow: action.payload.sow })))
    yield put(NotificationActions.willShowNotification({ message: "File uploaded", type: "info" }));
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
  yield put(UIActions.startActivityRunning("willGetSowsList"));
  try {
    yield call(willGetSowsListSeller)
    yield call(willGetSowsListBuyer)
    yield call(willGetSowsListArbitrator)
  } catch (error) {
    console.log("error in willGetSowsList ", error)
  }
  yield put(UIActions.stopActivityRunning("willGetSowsList"));
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
      sow.arbitrator && (yield call(willGetUserProfile, { user: sow.arbitrator }))
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
      sow.arbitrator && (yield call(willGetUserProfile, { user: sow.arbitrator }))
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
      sow.arbitrator && (yield call(willGetUserProfile, { user: sow.arbitrator }))
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
  const fullArbitrators = [] as any

  if (Array.isArray(action.payload.sow.arbitrators)) {
    for (const arb of action.payload.sow.arbitrators) {
      fullArbitrators.push(yield call(ArbitratorApi.getArbitrator, arb))
    }
  }
  console.log("in willSelectSow with fullArbitrators: ", fullArbitrators)
  yield put(SowActions.willConfirmArbitrators({ arbitrators: fullArbitrators, toggle: () => { } }))

  yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow.sow } });

  // if (action.payload.sow.status == "DRAFT") {
  //   action.payload.history.push('/create-statement-of-work')
  // }
  // else {
  action.payload.history.push('/statement-of-work/' + action.payload.sow.sow)
  // }
}

function* willGetSowAttachmentsList(action: any) {
  console.log("in willGetSowAttachmentsList with: ", action)

  try {
    const result = yield call(SowApi.getSowAttachmentsList, action.payload.sow);
    console.log("willGetSowAttachmentsList result: ", result)
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
          'type': attachment.type,
          'etag': attachment.etag
        }
      )
    }
    console.log("willGetSowAttachmentsList attachmentsSplitted: ", attachmentsSplitted)
    yield put(SowActions.didGetSowAttachmentsList(attachmentsSplitted))

  } catch (error) {
    console.log("error in willGetSowAttachmentsList ", error)
  }
}

function* willGetSow(action: any) {
  console.log("in willGetSow with: ", action)
  yield put(UIActions.startActivityRunning("getSow"));

  try {
    const result = yield call(SowApi.getSow, action.payload.sow);
    console.log("result willGetSow: ", result)
    if (result.sow == "error") {
      action.payload.history.push("/")
      yield put(NotificationActions.willShowNotification({ message: "Access denied", type: "danger" }));
    }
    else {
      yield call(willGetUserProfile, { user: result.seller })
      result.buyer != 'not_set' && (yield call(willGetUserProfile, { user: result.buyer }))
      if (result.arbitrator && result.arbitrator != 'not_set') {
        yield call(willGetUserProfile, { user: result.arbitrator })
        const arb = yield call(ArbitratorApi.getArbitrator, result.arbitrator)
        // console.log("willGetSow arb", arb)
        yield put(ArbitratorActions.willSelectArbitrator({ arbitrator: arb }))

      }
      yield put(SowActions.didGetSow(result))
      yield call(willGetSowAttachmentsList, { payload: { sow: action.payload.sow } });
      yield put(ChatActions.willReadSowChat(action.payload))

      const fullArbitrators = [] as any
      if (Array.isArray(result.arbitrators)) {
        for (const arb of result.arbitrators) {
          fullArbitrators.push(yield call(ArbitratorApi.getArbitrator, arb))
          yield call(willGetUserProfile, { user: arb })
        }
      }
      console.log("in willGetSow with fullArbitrators: ", fullArbitrators)
      yield put(SowActions.willConfirmArbitrators({ arbitrators: fullArbitrators, toggle: () => { } }))
    }
  } catch (error) {
    console.log("error in willGetSow ", error)
  }
  yield put(UIActions.stopActivityRunning("getSow"));
}

function* willBuildHtml(action: any) {
  console.log("in willBuildHtml with: ", action)
  yield put(UIActions.startActivityRunning("willBuildHtml"));
  const users = yield select(ProfileSelectors.getUsers)
  const currentSelectedArbitrator = yield select(ArbitratorsSelectors.getCurrentSelectedArbitrator)

  const seller_public_key = users[action.payload.currentSow.seller].public_key
  const buyer_public_key = users[action.payload.currentSow.buyer].public_key
  const arbitrator_public_key = users[action.payload.currentSow.arbitrator].public_key
  const backup_public_key = configuration[stage].uc_backup_public_key

  try {
    // const result = yield call(SowApi.buildHtmlBackend, action.payload.sow);
    // console.log("result willBuildHtmlBackend: ", result)
    const downloadUrlTemplate = yield call(SowApi.getDownloadUrl, action.payload.currentSow.sow, configuration[stage].legal_document_template_key, 600)
    // console.log("willBuildHtml downloadUrlTemplate: ", downloadUrlTemplate)
    const multisigAddress = yield call(TransactionApi.createMultiSigAddress, { seller: seller_public_key, buyer: buyer_public_key, arbitrator: arbitrator_public_key, backup: backup_public_key })
    // console.log("willBuildHtml multisigAddress: ", multisigAddress)
    
    const resultHtml = yield call(SowApi.getSowHtml,
      downloadUrlTemplate,
      {
        seller_name: users[action.payload.currentSow.seller].given_name + ' ' + users[action.payload.currentSow.seller].family_name,
        seller_address: users[action.payload.currentSow.seller].address.address + ', ' + users[action.payload.currentSow.seller].address.city + ', ' + users[action.payload.currentSow.seller].address.zip + ', ' + users[action.payload.currentSow.seller].address.state + ', ' + users[action.payload.currentSow.seller].address.country,
        buyer_name: users[action.payload.currentSow.buyer].given_name + ' ' + users[action.payload.currentSow.buyer].family_name,
        buyer_address: users[action.payload.currentSow.buyer].address.address + ', ' + users[action.payload.currentSow.buyer].address.city + ', ' + users[action.payload.currentSow.buyer].address.zip + ', ' + users[action.payload.currentSow.buyer].address.state + ', ' + users[action.payload.currentSow.buyer].address.country,
        title: action.payload.currentSow.title,
        startdate: new Date(action.payload.currentSow.submittedDate).toLocaleDateString(),
        price: action.payload.currentSow.price,
        currency: action.payload.currentSow.currency,
        msig_address: multisigAddress,
        uc_fee: "0.5%", //
        deadline: new Date(action.payload.currentSow.deadline).toLocaleDateString(),
        n_reviews: action.payload.currentSow.numberReviews,
        acceptance_time: new Date(action.payload.currentSow.sowExpiration).toLocaleDateString(),
        arbitrator_name: currentSelectedArbitrator.given_name + ' ' + currentSelectedArbitrator.family_name,
        arbitrator_address: users[action.payload.currentSow.arbitrator].address.address + ', ' + users[action.payload.currentSow.arbitrator].address.city + ', ' + users[action.payload.currentSow.arbitrator].address.zip + ', ' + users[action.payload.currentSow.arbitrator].address.state + ', ' + users[action.payload.currentSow.arbitrator].address.country,
        arbitrator_names: action.payload.arbitrators, //
        percentage_arbitrator_fee: currentSelectedArbitrator.fee.perc,
        flat_arbitrator_fee: currentSelectedArbitrator.fee.flat,
        description: action.payload.currentSow.description,
        definition_of_done: null, //"DEFINITION OF DONE PLACEHOLDER", //
        license: action.payload.currentSow.licenseTermsNotes,
        empty: action.payload.currentSow.licenseTermsOption,
        licenseTermsOption: action.payload.currentSow.licenseTermsOption,
        licenseTermsNotes: action.payload.currentSow.licenseTermsNotes
      }
    )

    yield put(SowActions.didBuildHtml(resultHtml))

  } catch (error) {
    console.log("error in willBuildHtml ", error)
  }
  yield put(UIActions.stopActivityRunning("willBuildHtml"));
}

function* willBuildPdf(action: any) {
  console.log("in willBuildPdf with: ", action)
  yield put(UIActions.startActivityRunning("willBuildPdf"));

  try {
    const resultPdfHash = yield call(SowApi.buildPdf, action.payload.sow);
    // console.log("result resultPdf: ", resultPdfHash)

    const resultDownloadUrl = yield call(SowApi.getDownloadUrl, action.payload.sow, action.payload.sow + '/' + configuration[stage].works_agreement_key, 600)

    const worksAgreementPdf = {
      pdfHash: resultPdfHash,
      downloadUrl: resultDownloadUrl
    }

    yield put(SowActions.didBuildPdf(worksAgreementPdf))

  } catch (error) {
    console.log("error in willBuildPdf ", error)
  }
  yield put(UIActions.stopActivityRunning("willBuildPdf"));
}