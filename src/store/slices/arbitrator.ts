import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'arbitrator',
  initialState: {
    arbitratorsList: []
  },
  reducers: {
    willGetArbitratorsList: (state, action: PayloadAction<any>) => state,
    didGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.sows)
  }
})

export const { actions, reducer }: any = currentSlice
export const { willGetArbitratorsList, didGetArbitratorsList } = actions
export const selectors = {
  getArbitratorsList: (state: any) => state.statementOfWork.arbitratorsList
}
