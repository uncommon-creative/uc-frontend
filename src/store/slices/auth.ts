import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { transpileModule } from "typescript";

export const currentSlice = createSlice({
  name: 'auth',
  initialState: {
    logged: false
  },
  reducers: {
    didLoginUser: (state, action: PayloadAction<any>) =>  state.logged = true as any
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey } = actions
export const selectors = {
  isLogged: (state: any) => state.logged,
}
