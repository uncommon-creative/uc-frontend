import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const axios = require('axios')
const Velocity = require('velocityjs');

export const createStatementOfWork = async () => {
  const mutation = loader('../graphql/createSow.gql')
  console.log("createSow API mutation: ", mutation)

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
  title: any,
  sowExpiration: any,
  licenseTermsOption: any,
  licenseTermsNotes: any
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
      title: title,
      sowExpiration: sowExpiration,
      licenseTermsOption: licenseTermsOption,
      licenseTermsNotes: licenseTermsNotes
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
  title: any,
  sowExpiration: any,
  licenseTermsOption: any,
  licenseTermsNotes: any
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
      title: title,
      sowExpiration: sowExpiration,
      licenseTermsOption: licenseTermsOption,
      licenseTermsNotes: licenseTermsNotes
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
    console.log("getUploadUrl API error: ", error)
  }
}

export const getDownloadUrl = async (sow: any, attachmentName: any, expires: any) => {
  const query = loader('../graphql/getDownloadUrl.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow, key: attachmentName, expires: expires }));
    // console.log('getDownloadUrl with result: ', result);
    return result.data.getDownloadUrl
  } catch (error) {
    console.log("getDownloadUrl API error: ", error)
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
    // console.log('listSowAttachments with result: ', result);
    return result.data.listSowAttachments.attachments
  } catch (error) {
    throw error
  }
}


export const getSow = async (sow: any) => {
  const query = loader('../graphql/getSowFromLink.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow }));
    console.log('getSow with result: ', result);
    return result.data.getSowFromLink
  } catch (error) {
    throw error
  }
}

export const getSowHtml = async (templt, data) => {
  try {
    const axiosResponse = await axios.get(templt);
    // console.log("getSowHtml axiosResponse: ", axiosResponse)

    const html_doc = Velocity.render(axiosResponse.data, {
      context: {
        SELLER_NAME: data.seller_name,
        SELLER_ADDRESS: data.seller_address,
        BUYER_NAME: data.buyer_name,
        BUYER_ADDRESS: data.buyer_address,
        TITLE: data.title,
        STARTDATE: data.startdate,
        PRICE: data.price,
        CURRENCY: data.currency,
        MSIG_ADDRESS: data.msig_address,
        UC_FEE: data.uc_fee,
        DEADLINE: data.deadline,
        N_REVIEWS: data.n_reviews,
        ACCEPTANCE_TIME: data.acceptance_time,
        ARBITRATOR_NAME: data.arbitrator_name,
        ARBITRATOR_NAMES: data.arbitrator_names,
        PERCENTAGE_ARBITRATOR_FEE: data.percentage_arbitrator_fee,
        FLAT_ARBITRATOR_FEE: data.flat_arbitrator_fee,
        DESCRIPTION: data.description,
        DEFINITION_OF_DONE: data.definition_of_done,
        LICENSE: data.license,
        EMPTY: data.empty,
        LICENSE_TERMS_OPTION: data.licenseTermsOption,
        LICENSE_TERMS_NOTES: data.licenseTermsNotes
      },
      util: {
        stringify: (obj) => JSON.stringify(obj)
      }
    });
    // console.log(html_doc);
    return html_doc;
  } catch (error) {
    throw error
  }
}

export const buildHtmlBackend = async (sow: any) => {
  const mutation = loader('../graphql/buildHtml.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow }));
    console.log('buildHtml with result: ', result);
    return result.data.buildHtml
  } catch (error) {
    throw error
  }
}

export const buildPdf = async (sow: any) => {
  const mutation = loader('../graphql/buildPdf.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow }));
    console.log('buildPdf with result: ', result);
    return result.data.buildPdf
  } catch (error) {
    throw error
  }
}