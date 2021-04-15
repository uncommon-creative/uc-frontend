import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SowCommands } from './sow'

export const currentSlice = createSlice({
  name: 'transaction',
  initialState: {
    // transactionPage: 1,
    transactionPage: {
      [`${SowCommands.SUBMIT}`]: 0,
      [`${SowCommands.ACCEPT_AND_PAY}`]: 0,
      [`${SowCommands.CLAIM_MILESTONE_MET}`]: 0,
      [`${SowCommands.ACCEPT_MILESTONE}`]: 0,
      [`${SowCommands.REJECT}`]: 0,
      [`${SowCommands.REQUEST_REVIEW}`]: 0,
    },
    params: {} as any,
    multiSig: {} as any,
    transactionAcceptAndPay: {} as any,
    algoSigner: {} as any,
    transactionAcceptMilestone: {} as any,
    signedMsig: {} as any,
    payment: {} as any,
    activePolls: {} as any,
    submitToken: "",
    transactionClaimMilestoneMet: {} as any,
    error: '',
    algorandAccountInfo: {}
  },
  reducers: {
    goToTransactionPage: (state, action: PayloadAction<any>) => void (state.transactionPage[action.payload.sowCommand] = action.payload.transactionPage),
    willGetAlgorandAccountInfo: (state, action: PayloadAction<any>) => state,
    didGetAlgorandAccountInfo: (state, action: PayloadAction<any>) => void (state.algorandAccountInfo = action.payload),
    willGetParams: (state, action: PayloadAction<any>) => state,
    didGetParams: (state, action: PayloadAction<any>) => void (state.params.withoutDelay = action.payload.params, state.transactionPage[action.payload.sowCommand] = 1),
    willGetParamsWithDelay: (state, action: PayloadAction<any>) => state,
    didGetParamsWithDelay: (state, action: PayloadAction<any>) => void (state.params.withDelay = action.payload.params, state.transactionPage[action.payload.sowCommand] = 1),

    willCreateMultiSigAddress: (state, action: PayloadAction<any>) => state,
    didCreateMultiSigAddress: (state, action: PayloadAction<any>) => void (state.multiSig = action.payload.multisig, state.transactionPage[action.payload.sowCommand] = 2),

    willPreparePayment: (state, action: PayloadAction<any>) => state,
    didPreparePayment: (state, action: PayloadAction<any>) => void (state.payment = action.payload),

    willSetSowArbitrator: (state, action: PayloadAction<any>) => state,
    didSetSowArbitrator: (state, action: PayloadAction<any>) => state,

    willAlgorandPollAccountAmount: (state, action: PayloadAction<any>) => state,
    didAlgorandPollAccountAmount: (state, action: PayloadAction<any>) => void (state.activePolls[action.payload.sow] = action.payload.timestamp),

    willCompleteTransactionAcceptAndPayQR: (state, action: PayloadAction<any>) => void (state.transactionPage[action.payload.sowCommand] = 3),
    // willCompleteTransactionAcceptAndPayPaid: (state, action: PayloadAction<any>) => state,
    willCompleteTransactionAcceptAndPayMnemonic: (state, action: PayloadAction<any>) => state,
    willCompleteTransactionAcceptAndPayAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptAndPay: (state, action: PayloadAction<any>) => void (state.transactionAcceptAndPay = action.payload.tx, state.transactionPage[action.payload.sowCommand] = 6),
    didCompleteTransactionAcceptAndPayFail: (state, action: PayloadAction<any>) => void (state.error = action.payload.error, state.transactionPage[action.payload.sowCommand] = 7),

    willCompleteTransactionClaimMilestoneMetMnemonic: (state, action: PayloadAction<any>) => state,
    willPrepareTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => state,
    didPrepareTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => void (state.algoSigner.accounts = action.payload, state.transactionPage[action.payload.sowCommand] = 5),
    willCompleteTransactionClaimMilestoneMetAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionClaimMilestoneMet: (state, action: PayloadAction<any>) => void (state.transactionClaimMilestoneMet = action.payload.tx, state.transactionPage[action.payload.sowCommand] = 6),
    didCompleteTransactionClaimMilestoneMetFail: (state, action: PayloadAction<any>) => void (state.error = action.payload.error, state.transactionPage[action.payload.sowCommand] = 7),

    willGetSignedMsig: (state, action: PayloadAction<any>) => state,
    didGetSignedMsig: (state, action: PayloadAction<any>) => void (state.signedMsig = action.payload.signedMsig, state.transactionPage[action.payload.sowCommand] = 2),
    willCompleteTransactionAcceptMilestoneMnemonic: (state, action: PayloadAction<any>) => state,
    willCompleteTransactionAcceptMilestoneAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionAcceptMilestone: (state, action: PayloadAction<any>) => void (state.transactionAcceptMilestone = action.payload.tx, state.transactionPage[action.payload.sowCommand] = 5),
    didCompleteTransactionAcceptMilestoneFail: (state, action: PayloadAction<any>) => void (state.error = action.payload.error, state.transactionPage[action.payload.sowCommand] = 6),

    willReject: (state, action: PayloadAction<any>) => void (state.transactionPage[action.payload.sowCommand] = 2),

    willRequestReview: (state, action: PayloadAction<any>) => state,
    didRequestReview: (state, action: PayloadAction<any>) => void (state.transactionPage[action.payload.sowCommand] = 2),

    willCompleteTransactionSubmitMnemonic: (state, action: PayloadAction<any>) => state,
    willPrepareAlgoSigner: (state, action: PayloadAction<any>) => state,
    didPrepareAlgoSigner: (state, action: PayloadAction<any>) => void (state.algoSigner.account = action.payload.account),
    willCompleteTransactionSubmitAlgoSigner: (state, action: PayloadAction<any>) => state,
    didCompleteTransactionSubmit: (state, action: PayloadAction<any>) => void (state.submitToken = action.payload.asset, state.transactionPage[action.payload.sowCommand] = 5),
    didCompleteTransactionSubmitFail: (state, action: PayloadAction<any>) => void (state.error = action.payload.error, state.transactionPage[action.payload.sowCommand] = 6),

    willDestroyAndCreateAssetMnemonic: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  goToTransactionPage, willGetParams, didGetParams,
  willCreateMultiSigAddress, didCreateMultiSigAddress,
  didCompleteTransactionAcceptAndPay, didCompleteTransactionAcceptAndPayFail,
  willCompleteTransactionAcceptAndPayQR, willCompleteTransactionAcceptAndPayMnemonic,
  willCompleteTransactionAcceptAndPayAlgoSigner,
  willCompleteTransactionClaimMilestoneMetMnemonic, didCompleteTransactionClaimMilestoneMet,
  didGetSignedMsig, willCompleteTransactionAcceptMilestoneMnemonic, didCompleteTransactionAcceptMilestone, didCompleteTransactionAcceptMilestoneFail,
  willReject, willRequestReview, didRequestReview
} = actions
export const selectors = {
  getAlgorandAccountInfo: (state: any) => state.transaction.algorandAccountInfo,
  getTransactionPage: (state: any) => state.transaction.transactionPage,
  getParams: (state: any) => state.transaction.params,
  getMultiSig: (state: any) => state.transaction.multiSig,
  getTransactionAcceptAndPay: (state: any) => state.transaction.transactionAcceptAndPay,
  getAlgoSigner: (state: any) => state.transaction.algoSigner,
  // getTransactionAcceptMilestone: (state: any) => state.transaction.transactionAcceptMilestone,
  getTransactionClaimMilestoneMet: (state: any) => state.transaction.transactionClaimMilestoneMet,
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