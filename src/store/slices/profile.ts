import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Profile {
  publicKey: string
}

export const currentSlice = createSlice({
  name: 'profile',
  initialState: {
    publicKey: ""
  },
  reducers: {
    addPublicKey: (state, action: PayloadAction<any>) =>  state.publicKey = action.payload
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey } = actions
export const selectors = {
  getPublicKey: (state: any) => state.publicKey,
}
