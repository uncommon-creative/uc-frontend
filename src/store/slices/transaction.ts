import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionPage: 1,
    params: {} as any,
    multiSig: {} as any,
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
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSig = action.payload, state.transactionPage = 2),

    willPreparePayment: (state, action: PayloadAction<any>) => state,
    didPreparePayment: (state, action: PayloadAction<any>) => void (state.payment = action.payload),

    willCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => void (state.transactionPage = 6),
    didCompleteTransactionAcceptAndPayQRFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

    willCompleteTransactionAcceptAndPayMnemonic: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPayMnemonic: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload, state.transactionPage = 6),
    didCompleteTransactionAcceptAndPayMnemonicFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

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
  willCompleteTransactionAcceptAndPayMnemonic, didCompleteTransactionAcceptAndPayMnemonic, didCompleteTransactionAcceptAndPayMnemonicFail,
  willSignTransactionClaimMilestoneMet, didSignTransactionClaimMilestoneMet,
  didGetSignedMsig, willCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestoneFail
} = actions
export const selectors = {
  getTransactionPage: (state: any) => state.transaction.transactionPage,
  getParams: (state: any) => state.transaction.params,
  getMultiSig: (state: any) => state.transaction.multiSig,
  getTransactionAcceptAndPay: (state: any) => state.transaction.transactionAcceptAndPay,
  getTransactionAcceptMilestone: (state: any) => state.transaction.transactionAcceptMilestone,
  getSignedMsig: (state: any) => state.transaction.signedMsig,
  getPayment: (state: any) => state.transaction.payment,
  getError: (state: any) => state.transaction.error,
}

// export const TransactionFee = 1000;
export const TransactionFee = 1000000;