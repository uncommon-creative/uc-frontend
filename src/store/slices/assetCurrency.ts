import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const assetsCurrencies = [
  {
    assetIndex: 15187514,
    assetName: "UC-USDT",
    fakeAssetEnum: "USDT"
  },
  {
    assetIndex: 15187465,
    assetName: "UC-USDC",
    fakeAssetEnum: "USDC"
  }
]

export const currentSlice = createSlice({
  name: 'assetCurrency',
  initialState: {
    modalOpen: false,
    modalPage: 0,
    assetsCurrencies: assetsCurrencies,
    currentAssetCurrency: {},
    optinResult: {} as any,
    error: ''
  },
  reducers: {
    toggleModalOpen: (state, action: PayloadAction<any>) => void (state.modalOpen = !state.modalOpen),
    goToModalPage: (state, action: PayloadAction<any>) => void (state.modalPage = action.payload.modalPage),
    willGoToAssetCurrencyPage: (state, action: PayloadAction<any>) => state,

    willSelectAssetCurrency: (state, action: PayloadAction<any>) => state,
    didSelectAssetCurrency: (state, action: PayloadAction<any>) => void (state.currentAssetCurrency = action.payload, state.modalPage = 1),

    willOptinAssetCurrency: (state, action: PayloadAction<any>) => state,
    didOptinAssetCurrency: (state, action: PayloadAction<any>) => void (state.optinResult = action.payload.tx, state.modalPage = 4),
    didOptinAssetCurrencyFail: (state, action: PayloadAction<any>) => void (state.error = action.payload.error, state.modalPage = 5),

    willDispenseAssetCurrency: (state, action: PayloadAction<any>) => state
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  toggleModalOpen, goToModalPage, willGoToAssetCurrencyPage,
  willSelectAssetCurrency, willOptinAssetCurrency, didOptinAssetCurrencyFail,
  willDispenseAssetCurrency
} = actions
export const selectors = {
  getModalOpen: (state: any) => state.assetCurrency.modalOpen,
  getModalPage: (state: any) => state.assetCurrency.modalPage,
  getAssetsCurrencies: (state: any) => state.assetCurrency.assetsCurrencies,
  getCurrentAssetCurrency: (state: any) => state.assetCurrency.currentAssetCurrency,
  getOptinResult: (state: any) => state.assetCurrency.optinResult,
  getError: (state: any) => state.assetCurrency.error,
}