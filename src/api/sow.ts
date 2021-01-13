import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

export const addStatementOfWork = async (
  arbitrators: any,
  codeOfConduct: any,
  currency: any,
  buyer: any,
  deadline: any,
  description: any,
  numberReviews: any,
  price: any,
  quantity: any,
  tags: any,
  termsOfService: any,
  title: any
) => {

  const mutation = loader('../graphql/addSow.gql')

  try {
    const result = await API.graphql(graphqlOperation(mutation, {
      arbitrators: arbitrators,
      codeOfConduct: codeOfConduct,
      currency: currency,
      buyer: buyer,
      deadline: deadline,
      description: description,
      numberReviews: numberReviews,
      price: price,
      quantity: quantity,
      tags: tags,
      termsOfService: termsOfService,
      title: title
    }))
    return result
  } catch (error) {
    console.log("addSow API error: ", error)
    throw error
  }
}