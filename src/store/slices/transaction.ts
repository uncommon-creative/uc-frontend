import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionPage: 1,
    params: {} as any,
    multiSigAddress: "",
    transactionAcceptAndPay: {} as any,
    transactionAcceptMilestone: {} as any,
    signedMsig: {} as any,
    error: ''
  },
  reducers: {
    cancelTransaction: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    willGetParams: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    didGetParams: (state, action: PayloadAction<any>) => void (state.params = action.payload),

    willCreateMultiSigAddress: (state, action: PayloadAction<any>) => state,
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSigAddress = action.payload, state.transactionPage = 2),

    willCompleteTransactionAcceptAndPay: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPay: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload, state.transactionPage = 3),
    didCompleteTransactionAcceptAndPayFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 4),

    willSignTransactionClaimMilestoneMet: (state, action: PayloadAction<any>) => state,
    didSignTransactionClaimMilestoneMet: (state, action: PayloadAction<any>) => void (state.transactionPage = 3),

    didGetSignedMsig: (state, action: PayloadAction<any>) => void (state.signedMsig = action.payload, state.transactionPage = 2),
    willCompleteTransactionAcceptMilestone: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptMilestone: (state, action: PayloadAction<any>) => void (state.transactionAcceptMilestone = action.payload, state.transactionPage = 3),
    didCompleteTransactionAcceptMilestoneFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 4),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  cancelTransaction, willGetParams, didGetParams,
  willCreateMultiSigAddress, didCreateMultiSigAddress,
  willCompleteTransactionAcceptAndPay, didCompleteTransactionAcceptAndPay, didCompleteTransactionAcceptAndPayFail,
  willSignTransactionClaimMilestoneMet, didSignTransactionClaimMilestoneMet,
  didGetSignedMsig, willCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestoneFail
} = actions
export const selectors = {
  getTransactionPage: (state: any) => state.transaction.transactionPage,
  getParams: (state: any) => state.transaction.params,
  getMultiSigAddress: (state: any) => state.transaction.multiSigAddress,
  getTransactionAcceptAndPay: (state: any) => state.transaction.transactionAcceptAndPay,
  getTransactionAcceptMilestone: (state: any) => state.transaction.transactionAcceptMilestone,
  getSignedMsig: (state: any) => state.transaction.signedMsig,
  getError: (state: any) => state.transaction.error,
}