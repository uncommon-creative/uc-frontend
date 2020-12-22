import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'statementOfWork',
  initialState: {
    sow: {}
  },
  reducers: {
    willCreateStatementOfWork: (state, action: PayloadAction<any>) => void (state.sow = action.payload),
  }
})

export const { actions, reducer }: any = currentSlice
export const { willCreateStatementOfWork } = actions
export const selectors = {
  getSOW: (state: any) => state.sow,
}
