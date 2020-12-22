import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    sow: {}
  },
  reducers: {
    willSelectArbitrators: (state, action: PayloadAction<any>) => state,
    willCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.sow = action.payload),
  }
})

export const { actions, reducer }: any = currentSlice
export const { willSelectArbitrators, willCreateStatementOfWork } = actions
export const selectors = {
  getSOW: (state: any) => state.sow,
}
