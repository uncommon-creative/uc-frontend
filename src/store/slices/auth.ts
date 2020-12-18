import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { transpileModule } from "typescript";

export const currentSlice = createSlice({
  name: 'auth',
  initialState: {
    confirmed: false,
    logged: false,
    checked: false,
    user: {} as {} | null,
    forgotPasswordRequested: false,
    error: undefined
  },
  reducers: {
    willConfirmUser: (state, action: PayloadAction<any>) => state,
    didConfirmUserSuccess: (state, action: PayloadAction<any>) => void (state.confirmed = true as any),
    didConfirmUserFails: (state, action: PayloadAction<any>) => void (state.error = action.payload),

    willLoginUser: (state, action: PayloadAction<any>) => state,
    didLoginUserSuccess: (state, action: PayloadAction<any>) => void (state.checked = true, state.logged = true as any, state.user = action.payload.user),
    didLoginUserFails: (state, action: PayloadAction<any>) => void (state.checked = true, state.error = action.payload),

    willLogoutUser: (state, action: PayloadAction<any>) => state,
    didLogoutUser: (state, action: PayloadAction<any>) => void (state.checked = true, state.logged = false as any, state.user = null),

    willSignupUser: (state, action: PayloadAction<any>) => state,
    didSignupUserSuccess: (state, action: PayloadAction<any>) => state,
    didSignupUserFails: (state, action: PayloadAction<any>) => void (state.error = action.payload),

    willForgotPasswordRequest: (state, action: PayloadAction<any>) => state,
    didForgotPasswordRequestSuccess: (state, action: PayloadAction<any>) => void (state.forgotPasswordRequested = true),
    didForgotPasswordRequestFails: (state, action: PayloadAction<any>) => void (state.error = action.payload),

    willForgotPasswordConfirm: (state, action: PayloadAction<any>) => state,
    didForgotPasswordConfirmSuccess: (state, action: PayloadAction<any>) => void (state.forgotPasswordRequested = false),
    didForgotPasswordConfirmFails: (state, action: PayloadAction<any>) => void (state.error = action.payload),

    willResendSignup: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willConfirmUser,
  didConfirmUserSuccess,
  didConfirmUserFails,
  willLoginUser,
  didLoginUserSuccess,
  didLoginUserFails,
  willLogoutUser,
  didLogoutUser,
  willSignupUser,
  didSignupUserSuccess,
  didSignupUserFails,
  willForgotPasswordRequest,
  didForgotPasswordRequestSuccess,
  didForgotPasswordRequestFails,
  willForgotPasswordConfirm,
  didForgotPasswordConfirmSuccess,
  didForgotPasswordConfirmFails
} = actions
export const selectors = {
  isLogged: (state: any) => state.auth.logged,
  isChecked: (state: any) => state.auth.checked,
  isAuthenticated: (state: any) => state.auth.logged,
  getLoggedError: (state: any) => state.auth.error,
  requestedForgotPassword: (state: any) => state.auth.forgotPasswordRequested
}
