import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

export const getArbitrator = async () => {
  const query = loader('../graphql/getFullArbitrator.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    // console.log('getArbitrator with rawResult: ', rawResult);
    return rawResult.data.getFullArbitrator

  } catch (error) {
    throw error
  }
}

export const getArbitratorsList = async () => {
  const query = loader('../graphql/getArbitratorsList.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    // console.log('getArbitratorsList with rawResult: ', rawResult);
    return rawResult.data.listArbitrators

  } catch (error) {
    throw error
  }
}

export const updateArbitrator = async (enabled: any, fee: any, currency: any, tags: any) => {
  const mutation = loader('../graphql/updateArbitrator.gql')

  try {
    const result = await API.graphql(graphqlOperation(mutation, {
      enabled: enabled,
      fee: fee,
      currency: currency,
      tags: tags
    }))
    // console.log("updateArbitrator raw result ", result)
    return result
  } catch (error) {
    console.log("updateArbitrator API error: ", error)
    throw error
  }
}

export const addArbitrator = async (fee: any, currency: any, tags: any) => {
  const mutation = loader('../graphql/addArbitrator.gql')

  try {
    const result = await API.graphql(graphqlOperation(mutation, {
      fee: fee,
      currency: currency,
      tags: tags
    }))
    return result
  } catch (error) {
    console.log("addArbitrator API error: ", error)
    throw error
  }
}