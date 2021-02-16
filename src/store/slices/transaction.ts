import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionPage: 1,
    params: {} as any,
    multiSigAddress: "",
    completedTransaction: {} as any,
    error: ''
  },
  reducers: {
    willGetParams: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    didGetParams: (state, action: PayloadAction<any>) => void (state.params = action.payload),

    willCreateMultiSigAddress: (state, action: PayloadAction<any>) => state,
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSigAddress = action.payload, state.transactionPage = 2),

    cancelTransaction: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),

    willCompleteTransaction: (state, action: PayloadAction<any>) => state,
    didCompleteTransaction: (state, action: PayloadAction<any>) => void (state.completedTransaction = action.payload, state.transactionPage = 3),
    didCompleteTransactionFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 4),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willGetParams, didGetParams,
  willPrepareMultiSigAddressData, willCreateMultiSigAddress, didCreateMultiSigAddress,
  willCompleteTransaction
} = actions
export const selectors = {
  getTransactionPage: (state: any) => state.transaction.transactionPage,
  getParams: (state: any) => state.transaction.params,
  getMultiSigAddress: (state: any) => state.transaction.multiSigAddress,
  getCompletedTransaction: (state: any) => state.transaction.completedTransaction,
  getError: (state: any) => state.transaction.error,
}