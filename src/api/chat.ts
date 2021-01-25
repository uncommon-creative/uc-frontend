import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')

export const listSowChatMessages = async (sow: any) => {
  const mutation = loader('../graphql/listSowChatMessages.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow }))
    console.log("listSowChatMessages result: ", result)
    return result.data.listSowChatMessages
  } catch (error) {
    console.log("listSowChatMessages API error: ", error)
    throw error
  }
}

export const sendMessageChat = async (message: any, sow: any, type: any) => {
  const mutation = loader('../graphql/sendSowChatMessage.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { textMessage: { message: message }, sow: sow, type: type }))
    // console.log("sendMessageChat result: ", result)
    return result.data.sendSowChatMessage
  } catch (error) {
    console.log("sendMessageChat API error: ", error)
    throw error
  }
}