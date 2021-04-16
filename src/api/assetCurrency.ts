import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

import { TransactionFee } from '../store/slices/transaction'
import { configuration } from '../config'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"
const algosdk = require('algosdk');

declare var AlgoSigner: any;

export function signOptinAssetCurrencyMnemonic(params: any, mnemonicSecretKey: any, address: any, assetId: any) {
  try {

    const txnOptin = algosdk.makeAssetTransferTxnWithSuggestedParams(address, address, undefined, undefined, 0, undefined, assetId, params)
    console.log("signOptinAssetCurrencyMnemonic txnOptin: ", txnOptin)

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    let signedOptinTxn = algosdk.signTransaction(txnOptin, secret_key.sk)
    signedOptinTxn.blob = signedOptinTxn.blob.toString()

    return [signedOptinTxn]
  } catch (error) {
    console.log("signOptinAssetCurrencyMnemonic API error: ", error)
    throw error
  }
}

export const algorandSendRawTx = async (tx: any) => {
  const mutation = loader('../graphql/algorandSendRawTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { tx: tx }))
    console.log("algorandSendRawTx result: ", result)
    return result.data.algorandSendRawTx
  } catch (error) {
    console.log("algorandSendRawTx API error: ", error)
    throw error
  }
}

export const algorandDispenseFakeAsset = async (address: any, asset: any) => {
  const mutation = loader('../graphql/algorandDispenseFakeAsset.gql')
  console.log("algorandDispenseFakeAsset address: ", address)
  console.log("algorandDispenseFakeAsset asset: ", asset)

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { addr: address, asset: asset }))
    console.log("algorandDispenseFakeAsset result: ", result)
    return result.data.algorandDispenseFakeAsset
  } catch (error) {
    console.log("algorandDispenseFakeAsset API error: ", error)
    throw error
  }
}