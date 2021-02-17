import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';
const algosdk = require('algosdk');

export const algorandGetTxParams = async () => {
  const query = loader('../graphql/algorandGetTxParams.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query));
    // console.log('algorandGetTxParams with result: ', result);
    return result.data.algorandGetTxParams
  } catch (error) {
    throw error
  }
}

export function createMultiSigAddress(payload: { seller: string, buyer: string, arbitrator: string, backup: string }): string {
  console.log("createMultiSigAddress payload: ", payload)
  const mparams = {
    version: 1,
    threshold: 2,
    addrs: [
      payload.seller,
      payload.buyer,
      payload.arbitrator,
      payload.backup
    ],
  };
  try {
    return algosdk.multisigAddress(mparams);;
  }
  catch (error) {
    console.log(error);
    return "error createMultiSigAddress";
  }
}

export function signTransaction(multiSigAddress: any, params: any, mnemonicSecretKey: any, price: any) {
  try {
    const txn = {
      "to": multiSigAddress,
      "fee": params.fee,
      "amount": price * 1000000 + params.fee,
      "firstRound": params.firstRound,
      "lastRound": params.lastRound,
      "genesisID": params.genesisID,
      "genesisHash": params.genesisHash,
      "note": new Uint8Array(0)
    };

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    const signedTxn = algosdk.signTransaction(txn, secret_key.sk);

    return signedTxn
  } catch (error) {
    console.log("signTransaction API error: ", error)
    throw error
  }
}

export const setSowArbitrator = async (sow: any, arbitrator: any) => {
  const mutation = loader('../graphql/setSowArbitrator.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, arbitrator: arbitrator }))
    // console.log("setSowArbitrator result: ", result)
    return result.data
  } catch (error) {
    console.log("setSowArbitrator API error: ", error)
    throw error
  }
}

export const sendTransaction = async (sow: any, signedTxn: any) => {
  const mutation = loader('../graphql/algorandSendTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, tx: signedTxn.blob.toString() }))
    // console.log("sendTransaction result: ", result)
    return result.data.algorandSendTx
  } catch (error) {
    console.log("sendTransaction API error: ", error)
    throw error
  }
}

export function signMultisigTransaction(multiSigAddress: any, sellerAddress: any, params: any, mnemonicSecretKey: any, price: any, mparams: any) {
  try {
    const txn = {
      "from": multiSigAddress,
      "to": sellerAddress,
      "fee": params.fee,
      "amount": price * 1000000,
      "firstRound": params.firstRound,
      "lastRound": params.lastRound,
      "genesisID": params.genesisID,
      "genesisHash": params.genesisHash,
      "note": new Uint8Array(0)
    };

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    const signedMultisigTxn = algosdk.signMultisigTransaction(txn, mparams, secret_key.sk);
    // console.log("in signMultisigTransaction signedMultisigTxn: ", signedMultisigTxn)
    return signedMultisigTxn
  } catch (error) {
    console.log("signMultisigTransaction API error: ", error)
    throw error
  }
}

export const setSignedMsig = async (sow: any, signedMsig: any) => {
  const mutation = loader('../graphql/setSignedMsig.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, signedMsig: signedMsig.blob.toString() }))
    // console.log("setSignedMsig result: ", result)
    return result.data.setSignedMsig
  } catch (error) {
    console.log("setSignedMsig API error: ", error)
    throw error
  }
}

export function appendSignMultisigTransaction(signedMsig: any, mnemonicSecretKey: any, msigparams: any) {
  try {

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    const buffer = Uint8Array.from(signedMsig.split(',') as any);

    const directsig = algosdk.appendSignMultisigTransaction(buffer, msigparams, secret_key.sk);
    // console.log("in appendSignMultisigTransaction directsig: ", directsig)
    return directsig
  } catch (error) {
    console.log("appendSignMultisigTransaction API error: ", error)
    throw error
  }
}

export const confirmTxAsBuyer = async (sow: any, tx: any) => {
  const mutation = loader('../graphql/confirmTxAsBuyer.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, tx: tx.blob.toString() }))
    // console.log("confirmTxAsBuyer result: ", result)
    return result.data.confirmTxAsBuyer
  } catch (error) {
    console.log("setSignedMsig API error: ", error)
    throw error
  }
}