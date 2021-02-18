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
    payment: {} as any,
    error: ''
  },
  reducers: {
    goToTransactionPage: (state, action: PayloadAction<any>) => void (state.transactionPage = action.payload),
    willGetAlgorandAccountInfo: (state, action: PayloadAction<any>) => state,
    willGetParams: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    didGetParams: (state, action: PayloadAction<any>) => void (state.params = action.payload),

    willCreateMultiSigAddress: (state, action: PayloadAction<any>) => state,
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSigAddress = action.payload, state.transactionPage = 2),

    didPreparePayment: (state, action: PayloadAction<any>) => void (state.payment = action.payload),
    willChoosePayment: (state, action: PayloadAction<any>) => void (state.transactionPage = action.payload),

    willCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => state,
    // didCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload, state.transactionPage = 6),
    // didCompleteTransactionAcceptAndPayQRFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

    willCompleteTransactionAcceptAndPaySeed: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPaySeed: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload, state.transactionPage = 6),
    didCompleteTransactionAcceptAndPaySeedFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

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
  goToTransactionPage, willGetParams, didGetParams,
  willCreateMultiSigAddress, didCreateMultiSigAddress,
  willCompleteTransactionAcceptAndPaySeed, didCompleteTransactionAcceptAndPaySeed, didCompleteTransactionAcceptAndPaySeedFail,
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

export const TransactionFee = 0.001;