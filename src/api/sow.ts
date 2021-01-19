import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

export const createStatementOfWork = async () => {
  const mutation = loader('../graphql/createSow.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation))
    console.log("rawResult createSow: ", result)
    return result.data.createSow

  } catch (error) {
    console.log("createSow API error: ", error)
    throw error
  }
}

export const addStatementOfWork = async (
  sow: any,
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
    const result: any = await API.graphql(graphqlOperation(mutation, {
      sow: sow,
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
    return result.data.addSow
  } catch (error) {
    console.log("addSow API error: ", error)
    throw error
  }
}

export const getUploadUrl = async (sow: any, attachmentName: any, expires: any) => {
  const query = loader('../graphql/getUploadUrl.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow, key: attachmentName, expires: expires }));
    console.log('getUploadUrl with result: ', result);
  } catch (error) {
    throw error
  }
}

export const uploadFileToS3 = (file: any) => {
  console.log("in uploadFileToS3")
};

export const getSowsListSeller = async () => {
  const query = loader('../graphql/getSowsListSeller.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    // console.log('getSowsListSeller with rawResult: ', rawResult);
    return rawResult.data.listSowsAsSeller

  } catch (error) {
    throw error
  }
}

export const getSowsListBuyer = async () => {
  const query = loader('../graphql/getSowsListBuyer.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    // console.log('getSowsListBuyer with rawResult: ', rawResult);
    return rawResult.data.listSowsAsBuyer

  } catch (error) {
    throw error
  }
}

export const getSowsListArbitrator = async () => {
  const query = loader('../graphql/getSowsListArbitrator.gql');

  try {
    const rawResult: any = await API.graphql({ query: query });
    // console.log('getSowsListArbitrator with rawResult: ', rawResult);
    return rawResult.data.listSowsAsArbitrator

  } catch (error) {
    throw error
  }
}