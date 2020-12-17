import { API } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash'; 

export const getProfileData = async () => {

  const query = loader('../graphql/getProfileData.gql');
  try {
    // return await API.graphql({ query: query, variables: { name: name }});
    const rawResult: any =  await API.graphql({ query: query });
    console.log('raw result: ', rawResult);
    const result = _.mapValues(rawResult.data, function(value: any) { 
      return value.value; 
    });
    console.log('with result: ', result);
    return result

  } catch (error) {
    throw error
  }
}
