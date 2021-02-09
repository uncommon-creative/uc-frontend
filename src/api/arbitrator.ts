import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')

export const getArbitrator = async (user: any) => {
  const query = loader('../graphql/getArbitrator.gql');

  try {
    const rawResult: any = await API.graphql(graphqlOperation(query, { user: user }));
    // console.log('getArbitrator with rawResult: ', rawResult);
    return rawResult.data.getArbitrator

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

export const getFullArbitratorsList = async () => {
  const url = "https://dbyc3f5xvj.execute-api.eu-west-1.amazonaws.com/dev/arbitrators"
  try {
    const axiosResponse = await axios.get(url);
    // console.log("getFullArbitratorsList axiosResponse: ", axiosResponse)
    return axiosResponse.data.arbitratorsList
  } catch (error) {
    console.log(error)
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