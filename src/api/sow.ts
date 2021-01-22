import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')

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

export const draftStatementOfWork = async (
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

  const mutation = loader('../graphql/draftSow.gql')

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
    // console.log("draftSow result: ", result)
    return result.data.draftSow
  } catch (error) {
    console.log("draftSow API error: ", error)
    throw error
  }
}

export const submitStatementOfWork = async (
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

  const mutation = loader('../graphql/submitSow.gql')

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
    // console.log("submitSow rawResult: ", result)
    return result.data.submitSow
  } catch (error) {
    console.log("submitSow API error: ", error)
    throw error
  }
}

export const getUploadUrl = async (sow: any, attachmentName: any, expires: any, fileType: any) => {
  const query = loader('../graphql/getUploadUrl.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow, key: attachmentName, expires: expires, type: fileType }));
    // console.log('getUploadUrl with result: ', result);
    return result.data.getUploadUrl
  } catch (error) {
    throw error
  }
}

export const uploadFileToS3 = async (url: any, file: any) => {
  try {
    const axiosResponse = await axios.put(url, file, {
      headers: { 'Content-Type': file.type, 'x-amz-acl': 'private' }
    });
    // console.log("uploadFileToS3 axiosResponse: ", axiosResponse)
  } catch (error) {
    console.log(error)
  }
}

export const deleteAttachment = async (fileName: any, sow: any) => {
  const mutation = loader('../graphql/deleteAttachment.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { key: fileName, sow: sow }))
    // console.log("in deleteAttachment result: ", result)
    return result.data.deleteAttachment
  } catch (error) {
    console.log("deleteAttachment API error: ", error)
    throw error
  }
}

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

export const getSowAttachmentsList = async (sow: any) => {
  const query = loader('../graphql/listSowAttachments.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow }));
    console.log('listSowAttachments with result: ', result);
    return result.data.listSowAttachments.attachments
  } catch (error) {
    throw error
  }
}