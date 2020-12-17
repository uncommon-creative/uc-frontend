import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Profile {
  publicKey: string
}

export const currentSlice = createSlice({
  name: 'profile',
  initialState: {
    publicKey: "",
    attributes: {}
  },
  reducers: {
    addPublicKey: (state, action: PayloadAction<any>) =>  state.publicKey = action.payload,
    willRetrieveProfileData: (state, action: PayloadAction<any>) =>  state,
    didRetrieveProfileData: (state, action: PayloadAction<any>) =>  void(state.attributes = action.payload)
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey, willRetrieveProfileData, didRetrieveProfileData } = actions
export const selectors = {
  getPublicKey: (state: any) => state.profile.publicKey,
  getProfile: (state: any) => state.profile.attributes
}
