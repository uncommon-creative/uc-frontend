import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    arbitrators: [],
    sow: {},
    sowsAsSeller: [],
    sowsAsBuyer: [],
    sowsAsArbitrator: []
  },
  reducers: {
    willConfirmArbitrators: (state, action: PayloadAction<any>) => void (state.arbitrators = action.payload.arbitrators),
    willCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.sow = action.payload.sow),

    willGetSowsListSeller: (state, action: PayloadAction<any>) => state,
    didGetSowsListSeller: (state, action: PayloadAction<any>) => void (state.sowsAsSeller = action.payload.sows),

    willGetSowsListBuyer: (state, action: PayloadAction<any>) => state,
    didGetSowsListBuyer: (state, action: PayloadAction<any>) => void (state.sowsAsBuyer = action.payload.sows),

    willGetSowsListArbitrator: (state, action: PayloadAction<any>) => state,
    didGetSowsListArbitrator: (state, action: PayloadAction<any>) => (state.sowsAsArbitrator = action.payload.sows)
  }
})

export const { actions, reducer }: any = currentSlice
export const { willConfirmArbitrators, willCreateStatementOfWork, willGetSowsListSeller, didGetSowsListSeller, willGetSowsListBuyer, didGetSowsListBuyer, willGetSowsListArbitrator, didGetSowsListArbitrator } = actions
export const selectors = {
  getArbitrators: (state: any) => state.statementOfWork.arbitrators,
  getSOW: (state: any) => state.statementOfWork.sow,
  getListSowsSeller: (state: any) => state.statementOfWork.sowsAsSeller,
  getListSowsBuyer: (state: any) => state.statementOfWork.sowsAsBuyer,
  getListSowsArbitrator: (state: any) => state.statementOfWork.sowsAsArbitrator
}
