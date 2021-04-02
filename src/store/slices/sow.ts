import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    currentArbitrators: [],
    attachments: [],
    newAttachments: [],
    currentSow: {} as any,
    sowsAsSeller: [] as any,
    sowsAsBuyer: [] as any,
    sowsAsArbitrator: [] as any,
    html: '',
    // pdfHash: '',
    worksAgreementPdf: {} as any
  },
  reducers: {
    willConfirmArbitrators: (state, action: PayloadAction<any>) => void (state.currentArbitrators = action.payload.arbitrators),

    willCreateStatementOfWork: (state, action: PayloadAction<any>) => state,
    didCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload),

    willDraftStatementOfWork: (state, action: PayloadAction<any>) => state,

    willSubmitStatementOfWork: (state, action: PayloadAction<any>) => state,
    didSubmitStatementOfWork: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload),

    willPrepareUploadAttachment: (state, action: PayloadAction<any>) => state,
    didPrepareUploadAttachment: (state, action: PayloadAction<any>) => void (state.newAttachments = action.payload),

    willDeleteAttachment: (state, action: PayloadAction<any>) => state,
    // didDeleteAttachment: (state, action: PayloadAction<any>) => void (state.attachments = action.payload),

    willGetSowsList: (state, action: PayloadAction<any>) => state,
    willGetSowsListSeller: (state, action: PayloadAction<any>) => state,
    didGetSowsListSeller: (state, action: PayloadAction<any>) => void (state.sowsAsSeller = action.payload.sows),
    willGetSowsListBuyer: (state, action: PayloadAction<any>) => state,
    didGetSowsListBuyer: (state, action: PayloadAction<any>) => void (state.sowsAsBuyer = action.payload.sows),
    willGetSowsListArbitrator: (state, action: PayloadAction<any>) => state,
    didGetSowsListArbitrator: (state, action: PayloadAction<any>) => void (state.sowsAsArbitrator = action.payload.sows),

    willSelectSow: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload.sow),

    willGetSowAttachmentsList: (state, action: PayloadAction<any>) => state,
    didGetSowAttachmentsList: (state, action: PayloadAction<any>) => void (state.attachments = action.payload, state.newAttachments = action.payload),

    willGetSow: (state, action: PayloadAction<any>) => state,
    didGetSow: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload),

    willBuildHtml: (state, action: PayloadAction<any>) => state,
    didBuildHtml: (state, action: PayloadAction<any>) => void (state.html = action.payload),
    willBuildPdf: (state, action: PayloadAction<any>) => state,
    didBuildPdf: (state, action: PayloadAction<any>) => void (state.worksAgreementPdf = action.payload),

  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willConfirmArbitrators, willCreateStatementOfWork, didCreateStatementOfWork, willDraftStatementOfWork, willSubmitStatementOfWork, didSubmitStatementOfWork,
  willPrepareUploadAttachment, didPrepareUploadAttachment, willDeleteAttachment,
  willGetSowsList, willGetSowsListSeller, didGetSowsListSeller, willGetSowsListBuyer, didGetSowsListBuyer, willGetSowsListArbitrator, didGetSowsListArbitrator,
  willSelectSow, willGetSowAttachmentsList, didGetSowAttachmentsList, willGetSow, didGetSow, willChooseArbitrator
} = actions
export const selectors = {
  getCurrentArbitrators: (state: any) => state.statementOfWork.currentArbitrators,
  getCurrentSow: (state: any) => state.statementOfWork.currentSow,
  getListSowsSeller: (state: any) => state.statementOfWork.sowsAsSeller,
  getListSowsBuyer: (state: any) => state.statementOfWork.sowsAsBuyer,
  getListSowsArbitrator: (state: any) => state.statementOfWork.sowsAsArbitrator,
  getAttachments: (state: any) => state.statementOfWork.attachments,
  getNewAttachments: (state: any) => state.statementOfWork.newAttachments,
  getHtml: (state: any) => state.statementOfWork.html,
  getWorksAgreementPdf: (state: any) => state.statementOfWork.worksAgreementPdf
}

export enum SowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED_PAID = 'ACCEPTED_PAID',
  MILESTONE_ACCEPTED = 'MILESTONE_ACCEPTED',
  MILESTONE_CLAIMED = 'MILESTONE_CLAIMED',
  REJECTED = 'REJECTED',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  DISPUTED = 'DISPUTED',
  EXPIRED = 'EXPIRED',
  PAYMENT_SENT = 'PAYMENT_SENT',
  SYSTEM_SIGNED = 'SYSTEM_SIGNED'
}

export enum SowCommands {
  SUBMIT = 'SUBMIT',
  ACCEPT_AND_PAY = 'ACCEPT_AND_PAY',
  ACCEPT_MILESTONE = 'ACCEPT_MILESTONE',
  CLAIM_MILESTONE_MET = 'CLAIM_MILESTONE_MET',
  REJECT = 'REJECT',
  REQUEST_REVIEW = 'REQUEST_REVIEW',
  FINALIZE_MSIG_TRANSACTION = 'FINALIZE_MSIG_TRANSACTION',
  SYSTEM_SIGN = 'SYSTEM_SIGN',
  CREATE_DELIVERABLE_TOKEN = 'CREATE_DELIVERABLE_TOKEN'
}