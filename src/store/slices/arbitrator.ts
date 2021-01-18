import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'arbitrator',
  initialState: {
    myArbitratorSettings: {},
    arbitratorsList: []
  },
  reducers: {
    willGetArbitrator: (state, action: PayloadAction<any>) => state,
    didGetArbitrator: (state, action: PayloadAction<any>) => void (state.myArbitratorSettings = action.payload),

    willGetArbitratorsList: (state, action: PayloadAction<any>) => state,
    didGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.arbitrators),

    willSaveArbitratorSettings: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const { willGetArbitrator, didGetArbitrator, willGetArbitratorsList, didGetArbitratorsList, willSaveArbitratorSettings } = actions
export const selectors = {
  getMyArbitratorSettings: (state: any) => state.arbitrator.myArbitratorSettings,
  getArbitratorsList: (state: any) => state.arbitrator.arbitratorsList
}
