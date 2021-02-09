import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Profile {
  publicKey: string
}

export const currentSlice = createSlice({
  name: 'profile',
  initialState: {
    publicKey: "",
    attributes: {} as any,
    algoAccount: {},
    users: {}
  },
  reducers: {
    willGoToProfile: (state, action: PayloadAction<any>) => state,

    willAddPublicKey: (state, action: PayloadAction<any>) => void (state.publicKey = action.payload.publicKey, state.attributes.publicKey = action.payload.publicKey),
    willRetrieveProfileData: (state, action: PayloadAction<any>) => state,
    didRetrieveProfileData: (state, action: PayloadAction<any>) => void (state.attributes = action.payload),

    willGenerateAlgoAccount: (state, action: PayloadAction<any>) => state,
    didGenerateAlgoAccount: (state, action: PayloadAction<any>) => void (state.algoAccount = action.payload),

    willGetUserProfile: (state, action: PayloadAction<any>) => state,
    // didGetUserProfile: (state, action: PayloadAction<any>) => void (state.users = state.users.concat(action.payload)),
    didGetUserProfile: (state: any, action: PayloadAction<any>) => {
      console.log("in didGetUserProfile with ", action)
      void (state.users[action.payload.userID] = action.payload.userData)
    },
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willGoToProfile,
  willAddPublicKey, willRetrieveProfileData, didRetrieveProfileData, didGenerateAlgoAccount,
  willGetUserProfile, didGetUserProfile
} = actions
export const selectors = {
  getUsers: (state: any) => state.profile.users,
  getPublicKey: (state: any) => state.profile.publicKey,
  getProfile: (state: any) => state.profile.attributes,
  getAlgoAccount: (state: any) => state.profile.algoAccount
}
