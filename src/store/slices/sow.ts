import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    confirmedArbitrators: [],
    attachments: [],
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

    willUploadAttachment: (state, action: PayloadAction<any>) => state,
    didUploadAttachment: (state, action: PayloadAction<any>) => void (state.attachments = action.payload),

    willDeleteAttachment: (state, action: PayloadAction<any>) => state,
    // didUploadAttachment: (state, action: PayloadAction<any>) => void (state.attachments = action.payload),

    willGetSowsListSeller: (state, action: PayloadAction<any>) => state,
    didGetSowsListSeller: (state, action: PayloadAction<any>) => void (state.sowsAsSeller = action.payload.sows),

    willGetSowsListBuyer: (state, action: PayloadAction<any>) => state,
    didGetSowsListBuyer: (state, action: PayloadAction<any>) => void (state.sowsAsBuyer = action.payload.sows),

    willGetSowsListArbitrator: (state, action: PayloadAction<any>) => state,
    didGetSowsListArbitrator: (state, action: PayloadAction<any>) => void (state.sowsAsArbitrator = action.payload.sows),

    willSelectSow: (state, action: PayloadAction<any>) => void (state.currentSow = action.payload.sow),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willConfirmArbitrators, willCreateStatementOfWork, didCreateStatementOfWork, willDraftStatementOfWork, willSubmitStatementOfWork, didSubmitStatementOfWork,
  willUploadAttachment, didUploadAttachment, willDeleteAttachment,
  willGetSowsListSeller, didGetSowsListSeller, willGetSowsListBuyer, didGetSowsListBuyer, willGetSowsListArbitrator, didGetSowsListArbitrator,
  willSelectSow
} = actions
export const selectors = {
  getConfirmedArbitrators: (state: any) => state.statementOfWork.confirmedArbitrators,
  getCurrentSow: (state: any) => state.statementOfWork.currentSow,
  getListSowsSeller: (state: any) => state.statementOfWork.sowsAsSeller,
  getListSowsBuyer: (state: any) => state.statementOfWork.sowsAsBuyer,
  getListSowsArbitrator: (state: any) => state.statementOfWork.sowsAsArbitrator
}
