import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: []
  },
  reducers: {
    willReadSowChat: (state, action: PayloadAction<any>) => state,
    didReadSowChat: (state, action: PayloadAction<any>) => void (state.messages = action.payload),

    willSendTextChat: (state, action: PayloadAction<any>) => state,
    willSendCommandChat: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willReadSowChat, didReadSowChat,
  willSendTextChat, willSendCommandChat
} = actions
export const selectors = {
}
