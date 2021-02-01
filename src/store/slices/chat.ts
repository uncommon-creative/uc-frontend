import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    message: '',
    unreadMessages: {
      asSeller: 0,
      asBuyer: 0,
      asArbitrator: 0,
    }
  },
  reducers: {
    willWriteMessage: (state, action: PayloadAction<any>) => void (state.message = action.payload),

    willReadSowChat: (state, action: PayloadAction<any>) => state,
    didReadSowChat: (state, action: PayloadAction<any>) => void (state.messages = action.payload),

    willSendTextChat: (state, action: PayloadAction<any>) => state,
    didSendTextChat: (state, action: PayloadAction<any>) => void (state.message = ''),
    willSendCommandChat: (state, action: PayloadAction<any>) => state,
    willSendAttachmentChat: (state, action: PayloadAction<any>) => state,

    didCountUnreadMessagesSeller: (state, action: PayloadAction<any>) => void (state.unreadMessages.asSeller = action.payload),
    didCountUnreadMessagesBuyer: (state, action: PayloadAction<any>) => void (state.unreadMessages.asBuyer = action.payload),
    didCountUnreadMessagesArbitrator: (state, action: PayloadAction<any>) => void (state.unreadMessages.asArbitrator = action.payload),
  }
})

export const { actions, reducer }: any = currentSlice
export const {
  willWriteMessage,
  willReadSowChat, didReadSowChat,
  willSendTextChat, didSendTextChat, willSendCommandChat, willSendAttachmentChat
} = actions
export const selectors = {
  getMessages: (state: any) => state.chat.messages,
  getMessage: (state: any) => state.chat.message,
  getUnreadMessages: (state: any) => state.chat.unreadMessages,
}
