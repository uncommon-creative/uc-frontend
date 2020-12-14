import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { transpileModule } from "typescript";

export const currentSlice = createSlice({
  name: 'auth',
  initialState: {
    logged: false,
    error: undefined
  },
  reducers: {
    willLoginUser: (state, action: PayloadAction<any>) =>  state,
    didLoginUserSuccess: (state, action: PayloadAction<any>) =>  state.logged = true as any,
    didLoginUserFails: (state, action: PayloadAction<any>) =>  void(state.error = action.payload),

    willSignupUser: (state, action: PayloadAction<any>) =>  state,
    didSignupUserSuccess: (state, action: PayloadAction<any>) =>  state,
    didSignupUserFails: (state, action: PayloadAction<any>) =>  void(state.error = action.payload)
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey } = actions
export const selectors = {
  isLogged: (state: any) => state.auth.logged,
  isAuthenticated: (state: any) => state.auth.logged,
  getLoggedError: (state: any) => state.auth.error
}
