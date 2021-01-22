import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'chat',
  initialState: {

  },
  reducers: {
    willSendTextChat: (state, action: PayloadAction<any>) => state,
    willSendCommandChat: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willSendTextChat, willSendCommandChat
} = actions
export const selectors = {
}
