import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';
import * as _ from 'lodash';

import { TransactionFee } from '../store/slices/transaction'
import { configuration } from '../config'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"
const algosdk = require('algosdk');

declare var AlgoSigner: any;

export const algorandGetAccountInfo = async (account: any) => {
  const query = loader('../graphql/algorandGetAccountInfo.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query, { account: account }));
    // console.log('algorandGetAccountInfo with result: ', result);
    return result.data.algorandGetAccountInfo
  } catch (error) {
    throw error
  }
}

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

export const algorandGetTxParamsWithDelay = async () => {
  const query = loader('../graphql/algorandGetTxParamsWithDelay.gql');

  try {
    const result: any = await API.graphql(graphqlOperation(query));
    // console.log('algorandGetTxParamsWithDelay with result: ', result);
    return result.data.algorandGetTxParamsWithDelay
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

export function signTransaction(multiSigAddress: any, params: any, mnemonicSecretKey: any, toPay: any) {
  try {
    console.log("signTransaction toPay: ", toPay)
    const txn = {
      "to": multiSigAddress,
      "fee": params.fee,
      "amount": toPay,
      "firstRound": params.firstRound,
      "lastRound": params.lastRound,
      "genesisID": params.genesisID,
      "genesisHash": params.genesisHash,
      "note": new Uint8Array(0)
    };
    console.log("signTransaction txn: ", txn)

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
    const buffer = Uint8Array.from(signedMsig.blob.split(',') as any);

    const directsig = algosdk.appendSignMultisigTransaction(buffer, msigparams, secret_key.sk);
    // console.log("in appendSignMultisigTransaction directsig: ", directsig)
    return directsig
  } catch (error) {
    console.log("appendSignMultisigTransaction API error: ", error)
    throw error
  }
}

export const algorandPutTransaction = async (sow: any, tx: any) => {
  const mutation = loader('../graphql/algorandPutTransaction.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, blob: tx.blob.toString() }))
    console.log("algorandPutTransaction result: ", result)
    return result.data.algorandPutTransaction
  } catch (error) {
    console.log("algorandPutTransaction API error: ", error)
    throw error
  }
}

export const algorandPollAccountAmount = async (id: any, account: any, amount: any) => {
  const query = loader('../graphql/algorandPollAccountAmount.gql')
  // console.log("in algorandPollAccountAmount id: ", id)
  // console.log("in algorandPollAccountAmount account: ", account)
  // console.log("in algorandPollAccountAmount amount: ", amount)

  try {
    const result: any = await API.graphql(graphqlOperation(query, { id: id, account: account, amount: amount }))
    // console.log("algorandPollAccountAmount result: ", result)
    return result.data.algorandPollAccountAmount
  } catch (error) {
    console.log("algorandPollAccountAmount API error: ", error)
    throw error
  }
}

export const algoConnect = async () => {
  try {
    let result = await AlgoSigner.connect();
    if (Object.keys(result).length === 0) {
      // console.log("algoConnect result: ", result);

      return result;
    }
  } catch (error) {
    console.log("algoConnect error: ", error)
    throw error
  }
}

export const algoGetAccounts = async () => {
  try {
    let accounts = await AlgoSigner.accounts({
      ledger: configuration[stage].algorand_net
    });
    // console.log("algoGetAccounts accounts: ", accounts)

    var accountsInfo = [] as any
    for (let account of accounts) {
      accountsInfo.push(await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/accounts/' + account.address,
      }))
    }
    // console.log("algoGetAccounts accountsInfo: ", accountsInfo)

    return accountsInfo;
  } catch (error) {
    console.log("algoGetAccounts error: ", error)
    throw error
  }
}

export const algoSign = async (from: any, multiSigAddress: any, toPay: any, sow: any) => {
  try {
    let paramsAlgoSigner = await AlgoSigner.algod({
      ledger: configuration[stage].algorand_net,
      path: '/v2/transactions/params',
    });

    const txn = {
      "from": from,
      "to": multiSigAddress,
      "fee": paramsAlgoSigner.fee,
      "type": 'pay',
      "amount": toPay,
      "firstRound": paramsAlgoSigner['last-round'],
      "lastRound": paramsAlgoSigner['last-round'] + 1000,
      "genesisID": paramsAlgoSigner['genesis-id'],
      "genesisHash": paramsAlgoSigner['genesis-hash'],
      "note": sow
    };

    let result = await AlgoSigner.sign(txn)
    console.log("algoSign result: ", result);
    return result;
  } catch (error) {
    console.log("algoSign error: ", error)
    throw error
  }
}

export const algoSendTx = async (signedTxn: any) => {
  try {
    let result = await AlgoSigner.send({
      ledger: configuration[stage].algorand_net,
      tx: signedTxn.blob,
    });
    console.log("algoSendTx result: ", result);
    return result;
  } catch (error) {
    console.log("algoSendTx error: ", error)
    throw error
  }
}

export const requestReview = async (sow: any, notes: any) => {
  const mutation = loader('../graphql/requestReview.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, notes: notes }))
    console.log("requestReview result: ", result)
    return result.data.requestReview
  } catch (error) {
    console.log("requestReview API error: ", error)
    throw error
  }
}

export const algorandGetTx = async (sow: any) => {
  const query = loader('../graphql/algorandGetTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(query, { sow: sow }))
    console.log("algorandGetTx result: ", result)
    return result.data.algorandGetTx
  } catch (error) {
    console.log("algorandGetTx API error: ", error)
    throw error
  }
}

export const algorandFinalizeTransaction = async (hash_round: any, round_sow: any, tx: any) => {
  const mutation = loader('../graphql/algorandFinalizeTransaction.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { hash_round: hash_round, round_sow: round_sow, blob: tx.blob.toString() }))
    console.log("algorandFinalizeTransaction result: ", result)
    return result.data.algorandFinalizeTransaction
  } catch (error) {
    console.log("algorandFinalizeTransaction API error: ", error)
    throw error
  }
}

export function signTxn(mnemonicSecretKey: any, params: any, addr: any, note: any, totalIssuance: any, decimals: any, defaultFrozen: any, manager: any, reserve: any, freeze: any, clawback: any, unitName: any, assetName: any, assetURL: any, assetMetadataHash: any) {
  try {
    let creationTxn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      addr,
      note,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params
    );
    // console.log("signTxn txn: ", creationTxn)

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    const rawSignedCreationTxn = creationTxn.signTxn(secret_key.sk);
    // console.log("signTxn rawSignedCreationTxn: ", rawSignedCreationTxn)

    return rawSignedCreationTxn
  } catch (error) {
    console.log("signTxn API error: ", error)
    throw error
  }
}

export const algorandSendTokenCreationTx = async (sow: any, tx: any) => {
  const mutation = loader('../graphql/algorandSendTokenCreationTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, tx: tx }))
    console.log("algorandSendTokenCreationTx result: ", result)
    return result.data.algorandSendTokenCreationTx
  } catch (error) {
    console.log("algorandSendTokenCreationTx API error: ", error)
    throw error
  }
}

export const algoSignSubmit = async (params: any, addr: any, note: any, totalIssuance: any, decimals: any, defaultFrozen: any, manager: any, reserve: any, freeze: any, clawback: any, unitName: any, assetName: any, assetURL: any, assetMetadataHash: any) => {
  try {
    let paramsAlgoSigner = await AlgoSigner.algod({
      ledger: configuration[stage].algorand_net,
      path: '/v2/transactions/params',
    });

    let creationTxn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      addr,
      note,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params
    );
    console.log("algoSignSubmit creationTxn: ", creationTxn)

    const algoTxn = {
      from: addr,
      assetName: creationTxn.assetName,
      assetUnitName: creationTxn.assetUnitName,
      assetTotal: creationTxn.assetTotal,
      assetDecimals: creationTxn.assetDecimals,
      note: creationTxn.note,
      type: creationTxn.type,
      fee: creationTxn.fee,
      firstRound: creationTxn.firstRound,
      lastRound: creationTxn.lastRound,
      genesisID: creationTxn.genesisID,
      genesisHash: creationTxn.genesisHash
    }

    let result = await AlgoSigner.sign(algoTxn)
    console.log("algoSign result: ", result);
    return result;
  } catch (error) {
    console.log("algoSign error: ", error)
    throw error
  }
}