import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    message: ''
  },
  reducers: {
    willWriteMessage: (state, action: PayloadAction<any>) => void (state.message = action.payload),

    willReadSowChat: (state, action: PayloadAction<any>) => state,
    didReadSowChat: (state, action: PayloadAction<any>) => void (state.messages = action.payload),

    willSendTextChat: (state, action: PayloadAction<any>) => state,
    didSendTextChat: (state, action: PayloadAction<any>) => void (state.message = ''),
    willSendCommandChat: (state, action: PayloadAction<any>) => state,
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willWriteMessage,
  willReadSowChat, didReadSowChat,
  willSendTextChat, didSendTextChat, willSendCommandChat
} = actions
export const selectors = {
  getMessages: (state: any) => state.chat.messages,
  getMessage: (state: any) => state.chat.message,
}
