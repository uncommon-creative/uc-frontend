import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    arbitrators: [],
    sow: {}
  },
  reducers: {
    willConfirmArbitrators: (state, action: PayloadAction<any>) => void (state.arbitrators = action.payload.arbitrators),
    willCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.sow = action.payload.sow),
  }
})

export const { actions, reducer }: any = currentSlice
export const { willConfirmArbitrators, willCreateStatementOfWork } = actions
export const selectors = {
  getArbitrators: (state: any) => state.statementOfWork.arbitrators,
  getSOW: (state: any) => state.statementOfWork.sow,
}
