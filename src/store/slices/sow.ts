import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import update from 'immutability-helper';

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    confirmedArbitrators: [],
    attachments: [],
    newAttachments: [],
    currentSow: {},
    sowsAsSeller: [],
    sowsAsBuyer: [],
    sowsAsArbitrator: []
  },
  reducers: {
    willConfirmArbitrators: (state, action: PayloadAction<any>) => void (state.confirmedArbitrators = action.payload.arbitrators),

    willCreateStatementOfWork: (state, action: PayloadAction<any>) => state,
    didCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload),

    willDraftStatementOfWork: (state, action: PayloadAction<any>) => state,

    willSubmitStatementOfWork: (state, action: PayloadAction<any>) => state,
    didSubmitStatementOfWork: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload),

    willPrepareUploadAttachment: (state, action: PayloadAction<any>) => state,
    didPrepareUploadAttachment: (state, action: PayloadAction<any>) => void (state.newAttachments = action.payload),

    willDeleteAttachment: (state, action: PayloadAction<any>) => state,
    // didDeleteAttachment: (state, action: PayloadAction<any>) => void (state.attachments = action.payload),

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
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willConfirmArbitrators, willCreateStatementOfWork, didCreateStatementOfWork, willDraftStatementOfWork, willSubmitStatementOfWork, didSubmitStatementOfWork,
  willPrepareUploadAttachment, didPrepareUploadAttachment, willDeleteAttachment,
  willGetSowsListSeller, didGetSowsListSeller, willGetSowsListBuyer, didGetSowsListBuyer, willGetSowsListArbitrator, didGetSowsListArbitrator,
  willSelectSow, willGetSowAttachmentsList, didGetSowAttachmentsList, willGetSow, didGetSow
} = actions
export const selectors = {
  getConfirmedArbitrators: (state: any) => state.statementOfWork.confirmedArbitrators,
  getCurrentSow: (state: any) => state.statementOfWork.currentSow,
  getListSowsSeller: (state: any) => state.statementOfWork.sowsAsSeller,
  getListSowsBuyer: (state: any) => state.statementOfWork.sowsAsBuyer,
  getListSowsArbitrator: (state: any) => state.statementOfWork.sowsAsArbitrator,
  getAttachments: (state: any) => state.statementOfWork.attachments,
  getNewAttachments: (state: any) => state.statementOfWork.newAttachments
}

export enum SowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  MILESTONE_ACCEPTED = 'MILESTONE_ACCEPTED',
  MILESTONE_CLAIMED = 'MILESTONE_CLAIMED',
  REJECTED = 'REJECTED',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  DISPUTED = 'DISPUTED',
  ACCEPTED_PAID = 'ACCEPTED_PAID'
}

export enum SowCommands {
  ACCEPT_MILESTONE = 'ACCEPT_MILESTONE',
  CLAIM_MILESTONE_MET = 'CLAIM_MILESTONE_MET',
  REJECT = 'REJECT',
  REQUEST_REVIEW = 'REQUEST_REVIEW',
  ACCEPT_AND_PAY = 'ACCEPT_AND_PAY'
}