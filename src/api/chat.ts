import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')

export const listSowChatMessages = async (sow: any) => {
  const mutation = loader('../graphql/listSowChatMessages.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow }))
    // console.log("listSowChatMessages result: ", result)
    return result.data.listSowChatMessages
  } catch (error) {
    console.log("listSowChatMessages API error: ", error)
    throw error
  }
}

export const sendTextChat = async (message: any, sow: any, type: any) => {
  const mutation = loader('../graphql/sendSowChatMessage.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { textMessage: { message: message }, sow: sow, type: type }))
    // console.log("sendTextChat result: ", result)
    return result.data.sendSowChatMessage
  } catch (error) {
    console.log("sendTextChat API error: ", error)
    throw error
  }
}

export const sendCommandChat = async (command: any, sow: any, type: any) => {
  const mutation = loader('../graphql/sendSowChatMessage.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { commandMessage: { command: command }, sow: sow, type: type }))
    console.log("sendCommandChat result: ", result)
    return result.data.sendSowChatMessage
  } catch (error) {
    console.log("sendCommandChat API error: ", error)
    throw error
  }
}

export const sendAttachmentChat = async (key: any, sow: any, type: any) => {
  const mutation = loader('../graphql/sendSowChatMessage.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { attachmentMessage: { key: key }, sow: sow, type: type }))
    console.log("sendAttachmentChat result: ", result)
    return result.data.sendSowChatMessage
  } catch (error) {
    console.log("sendAttachmentChat API error: ", error)
    throw error
  }
}