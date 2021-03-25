import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')

export const getProfileData = async (user: any) => {
  const query = loader('../graphql/getProfileData.gql');

  try {
    const rawResult: any = await API.graphql(graphqlOperation(query, { user: user }));
    // console.log('getProfileData raw result: ', rawResult);
    const result = _.mapValues(rawResult.data, function (value: any, name: any) {
      return value && (name == 'address' ? JSON.parse(value.value) : value.value);
    });
    console.log('getProfileData with result: ', result);
    return result

  } catch (error) {
    console.log("getProfileData error ", error)
    throw error
  }
}

export const putProfileData = async (name: string, value: string) => {
  const mutation = loader('../graphql/putProfileData.gql')

  try {
    const result = await API.graphql(graphqlOperation(mutation, { name: name, value: value }))
    return result
  } catch (error) {
    console.log("putProfileData API error: ", error)
    throw error
  }
}

export const getResourceUrl = async (key: any, expires: any, type: any) => {
  const query = loader('../graphql/getResourceUrl.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(query, { key: key, expires: expires, type: type }))
    console.log("getResourceUrl result: ", result)
    return result.data.getResourceUrl
  } catch (error) {
    console.log("getResourceUrl API error: ", error)
    throw error
  }
}

export const uploadFileToS3 = async (url: any, file: any) => {
  try {
    const axiosResponse = await axios.put(url, file, {
      headers: { 'Content-Type': file.type, 'x-amz-acl': 'private' }
    });
    console.log("uploadFileToS3 axiosResponse: ", axiosResponse)
  } catch (error) {
    console.log(error)
  }
}