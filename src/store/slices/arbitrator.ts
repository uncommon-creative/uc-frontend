import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'arbitrator',
  initialState: {
    selectingArbitrators: false,
    myArbitratorSettings: {},
    arbitratorsList: [],

    currentArbitrator: {},
    currentSelectedArbitrators: []
  },
  reducers: {
    willGetArbitrator: (state, action: PayloadAction<any>) => state,
    didGetArbitrator: (state, action: PayloadAction<any>) => void (state.myArbitratorSettings = action.payload),

    willGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.selectingArbitrators = true),
    didGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.arbitrators),

    willGetFullArbitratorsList: (state, action: PayloadAction<any>) => void (state.selectingArbitrators = false),
    didGetFullArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.arbitrators),

    willSaveArbitratorSettings: (state, action: PayloadAction<any>) => state,


    willViewCurrentArbitrator: (state, action: PayloadAction<any>) => void (state.currentArbitrator = action.payload),
    willSelectArbitrator: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators = state.currentSelectedArbitrators.concat(action.payload)),
    willDeselectArbitrator: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators.splice(action.payload, 1)),
    willSelectThreeArbitrators: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators = action.payload),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willGetArbitrator, didGetArbitrator,
  willGetArbitratorsList, didGetArbitratorsList, willGetFullArbitratorsList, didGetFullArbitratorsList,
  willSaveArbitratorSettings
} = actions
export const selectors = {
  isSelectingArbitrators: (state: any) => state.arbitrator.selectingArbitrators,
  getMyArbitratorSettings: (state: any) => state.arbitrator.myArbitratorSettings,
  getArbitratorsList: (state: any) => state.arbitrator.arbitratorsList,
  getCurrentArbitrator: (state: any) => state.arbitrator.currentArbitrator,
  getCurrentSelectedArbitrators: (state: any) => state.arbitrator.currentSelectedArbitrators,
}
