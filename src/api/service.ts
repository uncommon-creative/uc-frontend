import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

export const getProfileData = async () => {
  const query = loader('../graphql/getProfileData.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    console.log('getProfileData raw result: ', rawResult);
    const result = _.mapValues(rawResult.data, function (value: any) {
      return value && value.value;
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