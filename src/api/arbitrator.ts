import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

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