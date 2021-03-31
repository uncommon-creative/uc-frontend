import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionPage: 1,
    params: {} as any,
    multiSig: {} as any,
    transactionAcceptAndPay: {} as any,
    algoSigner: {} as any,
    transactionAcceptMilestone: {} as any,
    signedMsig: {} as any,
    payment: {} as any,
    activePolls: {} as any,
    submitToken: "",
    error: ''
  },
  reducers: {
    goToTransactionPage: (state, action: PayloadAction<any>) => void (state.transactionPage = action.payload),
    willGetAlgorandAccountInfo: (state, action: PayloadAction<any>) => state,
    willGetParams: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    didGetParams: (state, action: PayloadAction<any>) => void (state.params = action.payload),
    willGetParamsWithDelay: (state, action: PayloadAction<any>) => void (state.transactionPage = 1),
    didGetParamsWithDelay: (state, action: PayloadAction<any>) => void (state.params = action.payload),

    willCreateMultiSigAddress: (state, action: PayloadAction<any>) => state,
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSig = action.payload, state.transactionPage = 2),

    willPreparePayment: (state, action: PayloadAction<any>) => state,
    didPreparePayment: (state, action: PayloadAction<any>) => void (state.payment = action.payload),

    willSetSowArbitrator: (state, action: PayloadAction<any>) => state,
    didSetSowArbitrator: (state, action: PayloadAction<any>) => state,

    willAlgorandPollAccountAmount: (state, action: PayloadAction<any>) => state,
    didAlgorandPollAccountAmount: (state, action: PayloadAction<any>) => void (state.activePolls[action.payload.sow] = action.payload.timestamp),

    willCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => void (state.transactionPage = 3),
    willCompleteTransactionAcceptAndPayPaid: (state, action: PayloadAction<any>) => state,
    willCompleteTransactionAcceptAndPayMnemonic: (state, action: PayloadAction<any>) => state,
    willPrepareTransactionAcceptAndPayAlgoSigner: (state, action: PayloadAction<any>) => state,
    didPrepareTransactionAcceptAndPayAlgoSigner: (state, action: PayloadAction<any>) => void (state.algoSigner.accounts = action.payload, state.transactionPage = 5),
    willCompleteTransactionAcceptAndPayAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPay: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload, state.transactionPage = 6),
    didCompleteTransactionAcceptAndPayFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

    willCompleteTransactionClaimMilestoneMetMnemonic: (state, action: PayloadAction<any>) => state,
    willPrepareTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => state,
    didPrepareTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => void (state.algoSigner.accounts = action.payload, state.transactionPage = 5),
    willCompleteTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionClaimMilestoneMet: (state, action: PayloadAction<any>) => void (state.transactionPage = 6),
    didCompleteTransactionClaimMilestoneMetFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 7),

    willGetSignedMsig: (state, action: PayloadAction<any>) => state,
    didGetSignedMsig: (state, action: PayloadAction<any>) => void (state.signedMsig = action.payload, state.transactionPage = 2),
    willCompleteTransactionAcceptMilestoneMnemonic: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptMilestone: (state, action: PayloadAction<any>) => void (state.transactionAcceptMilestone = action.payload, state.transactionPage = 3),
    didCompleteTransactionAcceptMilestoneFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 4),

    willReject: (state, action: PayloadAction<any>) => void (state.transactionPage = 2),

    willRequestReview: (state, action: PayloadAction<any>) => state,
    didRequestReview: (state, action: PayloadAction<any>) => void (state.transactionPage = 2),

    willCompleteTransactionSubmitMnemonic: (state, action: PayloadAction<any>) => state,
    willPrepareTransactionSubmitAlgoSigner: (state, action: PayloadAction<any>) => state,
    didPrepareTransactionSubmitAlgoSigner: (state, action: PayloadAction<any>) => void (state.algoSigner.accounts = action.payload, state.transactionPage = 4),
    willCompleteTransactionSubmitAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionSubmit: (state, action: PayloadAction<any>) => void (state.submitToken = action.payload, state.transactionPage = 5),
    didCompleteTransactionSubmitFail: (state, action: PayloadAction<any>) => void (state.error = action.payload, state.transactionPage = 6),

    willDestroyAndCreateAsset: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  goToTransactionPage, willGetParams, didGetParams,
  willCreateMultiSigAddress, didCreateMultiSigAddress,
  didCompleteTransactionAcceptAndPay, didCompleteTransactionAcceptAndPayFail,
  willCompleteTransactionAcceptAndPayQR, willCompleteTransactionAcceptAndPayMnemonic,
  willPrepareTransactionAcceptAndPayAlgoSigner, didPrepareTransactionAcceptAndPayAlgoSigner, willCompleteTransactionAcceptAndPayAlgoSigner,
  willCompleteTransactionClaimMilestoneMetMnemonic, didCompleteTransactionClaimMilestoneMet,
  didGetSignedMsig, willCompleteTransactionAcceptMilestoneMnemonic, didCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestoneFail,
  willReject, willRequestReview, didRequestReview
} = actions
export const selectors = {
  getTransactionPage: (state: any) => state.transaction.transactionPage,
  getParams: (state: any) => state.transaction.params,
  getMultiSig: (state: any) => state.transaction.multiSig,
  getTransactionAcceptAndPay: (state: any) => state.transaction.transactionAcceptAndPay,
  getAlgoSigner: (state: any) => state.transaction.algoSigner,
  getTransactionAcceptMilestone: (state: any) => state.transaction.transactionAcceptMilestone,
  getSignedMsig: (state: any) => state.transaction.signedMsig,
  getPayment: (state: any) => state.transaction.payment,
  getActivePolls: (state: any) => state.transaction.activePolls,
  getSubmitToken: (state: any) => state.transaction.submitToken,
  getError: (state: any) => state.transaction.error,
}

export const AlgorandFee = 1000;
export const AlgorandMinBalance = 100000;
// export const TransactionFee = 1000;
export const TransactionFee = 1000000;