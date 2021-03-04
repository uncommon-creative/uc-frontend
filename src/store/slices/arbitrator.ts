import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'arbitrator',
  initialState: {
    selectingThreeArbitrators: false,
    selectingOneArbitrator: false,
    myArbitratorSettings: {},
    arbitratorsList: [],

    currentArbitrator: {},
    currentChosenArbitrator: '',
    currentSelectedArbitrators: [],
  },
  reducers: {
    willGetArbitrator: (state, action: PayloadAction<any>) => state,
    didGetArbitrator: (state, action: PayloadAction<any>) => void (state.myArbitratorSettings = action.payload),

    willGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.selectingThreeArbitrators = true, state.selectingOneArbitrator = false),
    didGetArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.arbitrators),

    willGetFullArbitratorsList: (state, action: PayloadAction<any>) => void (state.selectingThreeArbitrators = false, state.selectingOneArbitrator = false),
    didGetFullArbitratorsList: (state, action: PayloadAction<any>) => void (state.arbitratorsList = action.payload.arbitrators),

    willSaveArbitratorSettings: (state, action: PayloadAction<any>) => state,


    willViewCurrentArbitrator: (state, action: PayloadAction<any>) => state,
    didViewCurrentArbitrator: (state, action: PayloadAction<any>) => void (state.currentArbitrator = action.payload),
    willAddArbitrator: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators = state.currentSelectedArbitrators.concat(action.payload)),
    willDeselectArbitrator: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators.splice(action.payload, 1)),
    willSelectThreeArbitrators: (state, action: PayloadAction<any>) => void (state.currentSelectedArbitrators = action.payload),

    selectingOneArbitrator: (state, action: PayloadAction<any>) => void (state.selectingThreeArbitrators = false, state.selectingOneArbitrator = true),

    willChooseArbitrator: (state, action: PayloadAction<any>) => void (state.currentChosenArbitrator = action.payload),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willGetArbitrator, didGetArbitrator,
  willGetArbitratorsList, didGetArbitratorsList, willGetFullArbitratorsList, didGetFullArbitratorsList,
  willSaveArbitratorSettings
} = actions
export const selectors = {
  isSelectingThreeArbitrators: (state: any) => state.arbitrator.selectingThreeArbitrators,
  isSelectingOneArbitrator: (state: any) => state.arbitrator.selectingOneArbitrator,
  getMyArbitratorSettings: (state: any) => state.arbitrator.myArbitratorSettings,
  getArbitratorsList: (state: any) => state.arbitrator.arbitratorsList,
  getCurrentArbitrator: (state: any) => state.arbitrator.currentArbitrator,
  getCurrentChosenArbitrator: (state: any) => state.arbitrator.currentChosenArbitrator,
  getCurrentSelectedArbitrators: (state: any) => state.arbitrator.currentSelectedArbitrators,
}
