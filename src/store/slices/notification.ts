import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'notification',
  initialState: {
    visible: false,
    message: "",
    type: "success",
    dismissable: false,
    delay: 5000,
    rightMessage: "Test"
  }
  ,
  reducers: {
    willShowNotification: (state, action: PayloadAction<any>) => void (
      state.visible = true as any,
      state.message = action.payload.message,
      state.type = action.payload.type,
      state.delay = action.payload.delay != undefined ? action.payload.delay : 5000
    ),
    willHideNotification: (state, action: PayloadAction<any>) => void (state.visible = false as any)
  }
})

export const { actions, reducer }: any = currentSlice
export const { addPublicKey } = actions
export const selectors = {
  getNotification: (state: any) => state.notification,
}
