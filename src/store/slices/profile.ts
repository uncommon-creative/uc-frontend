import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Profile {
  publicKey: string
}

export const currentSlice = createSlice({
  name: 'profile',
  initialState: {
    loadingProfile: false,
    uploadingPortrait: false,
    publicKey: "",
    attributes: {} as any,
    algorandAccount: {},
    algoAccount: {},
    users: {}
  },
  reducers: {
    startLoadingProfile: (state, action: PayloadAction<any>) => void (state.loadingProfile = true),
    stopLoadingProfile: (state, action: PayloadAction<any>) => void (state.loadingProfile = false),

    willGoToProfile: (state, action: PayloadAction<any>) => state,

    willAddPublicKey: (state, action: PayloadAction<any>) => void (state.publicKey = action.payload.publicKey, state.attributes.publicKey = action.payload.publicKey),
    willRetrieveProfileData: (state, action: PayloadAction<any>) => state,
    didRetrieveProfileData: (state, action: PayloadAction<any>) => void (state.attributes = action.payload),
    didRetrieveAlgorandData: (state, action: PayloadAction<any>) => void (state.algorandAccount = action.payload),

    willGenerateAlgoAccount: (state, action: PayloadAction<any>) => state,
    didGenerateAlgoAccount: (state, action: PayloadAction<any>) => void (state.algoAccount = action.payload),

    willGetUserProfile: (state, action: PayloadAction<any>) => state,
    // didGetUserProfile: (state, action: PayloadAction<any>) => void (state.users = state.users.concat(action.payload)),
    didGetUserProfile: (state: any, action: PayloadAction<any>) => void (state.users[action.payload.userID] = action.payload.userData),

    willUploadPortrait: (state, action: PayloadAction<any>) => void (state.uploadingPortrait = true),
    didUploadPortrait: (state, action: PayloadAction<any>) => void (state.uploadingPortrait = false),

    willSubmitProfile: (state, action: PayloadAction<any>) => state,
    didSubmitProfile: (state, action: PayloadAction<any>) => state,

    willSaveProfile: (state, action: PayloadAction<any>) => state,
    didSaveProfile: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  startLoadingProfile, stopLoadingProfile, willGoToProfile, didGoToProfile,
  willAddPublicKey, willRetrieveProfileData, didRetrieveProfileData, didGenerateAlgoAccount,
  willGetUserProfile, didGetUserProfile,
  willUploadPortrait, didUploadPortrait, willSubmitProfile, didSubmitProfile
} = actions
export const selectors = {
  isLoadingProfile: (state: any) => state.profile.loadingProfile,
  isUploadingPortrait: (state: any) => state.profile.uploadingPortrait,
  getUsers: (state: any) => state.profile.users,
  getPublicKey: (state: any) => state.profile.publicKey,
  getProfile: (state: any) => state.profile.attributes,
  getAlgoAccount: (state: any) => state.profile.algoAccount,
  getAlgorandAccount: (state: any) => state.profile.algorandAccount
}
