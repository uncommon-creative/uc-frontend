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

export const getSowsListSeller = async () => {
  const query = loader('../graphql/getSowListSeller.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });

    console.log('getSowsListSeller with rawResult: ', rawResult);
    return rawResult.data.listSowsAsSeller

  } catch (error) {
    throw error
  }
}

export const getSowsListBuyer = async () => {
  const query = loader('../graphql/getSowListBuyer.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });

    console.log('getSowsListBuyer with rawResult: ', rawResult);
    return rawResult.data.listSowsAsBuyer

  } catch (error) {
    throw error
  }
}

export const getSowsListArbitrator = async () => {
  const query = loader('../graphql/getSowListArbitrator.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });

    console.log('getSowsListArbitrator with rawResult: ', rawResult);
    return rawResult.data.listSowsAsArbitrator

  } catch (error) {
    throw error
  }
}