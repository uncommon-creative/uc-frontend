import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { transpileModule } from "typescript";

export const currentSlice = createSlice({
  name: 'auth',
  initialState: {
    confirmed: false,
    logged: false,
    checked: false,
    user: {},
    error: undefined
  },
  reducers: {
    willConfirmUser: (state, action: PayloadAction<any>) => state,
    didConfirmUserSuccess: (state, action: PayloadAction<any>) => void(state.confirmed = true as any),
    didConfirmUserFails: (state, action: PayloadAction<any>) => void(state.error = action.payload),

    willLoginUser: (state, action: PayloadAction<any>) =>  state,
    didLoginUserSuccess: (state, action: PayloadAction<any>) =>  void(state.checked = true, state.logged = true as any, state.user = action.payload.user),
    didLoginUserFails: (state, action: PayloadAction<any>) =>  void(state.checked = true, state.error = action.payload),

    willSignupUser: (state, action: PayloadAction<any>) =>  state,
    didSignupUserSuccess: (state, action: PayloadAction<any>) =>  state,
    didSignupUserFails: (state, action: PayloadAction<any>) =>  void(state.error = action.payload)
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey } = actions
export const selectors = {
  isLogged: (state: any) => state.auth.logged,
  isChecked: (state: any) => state.auth.checked,
  isAuthenticated: (state: any) => state.auth.logged,
  getLoggedError: (state: any) => state.auth.error
}
