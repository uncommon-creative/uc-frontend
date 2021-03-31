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

export function signTransactionsAcceptAndPayMnemonic(multiSigAddress: any, params: any, mnemonicSecretKey: any, toPay: any, buyer: any, seller: any, assetId: any) {
  try {

    const txnOptin = algosdk.makeAssetTransferTxnWithSuggestedParams(buyer, buyer, undefined, undefined, 0, undefined, assetId, params)
    console.log("signTransactionsAcceptAndPayMnemonic txnOptin: ", txnOptin)

    const txnPayment = algosdk.makePaymentTxnWithSuggestedParams(buyer, multiSigAddress, toPay, undefined, undefined, params);
    console.log("signTransactionsAcceptAndPayMnemonic txnPayment: ", txnPayment)

    let gid = algosdk.assignGroupID([txnOptin, txnPayment]);

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    let signedOptinTxn = algosdk.signTransaction(txnOptin, secret_key.sk)
    signedOptinTxn.blob = signedOptinTxn.blob.toString()
    let signedPaymentTxn = algosdk.signTransaction(txnPayment, secret_key.sk)
    signedPaymentTxn.blob = signedPaymentTxn.blob.toString()
    const signedGroup = [signedOptinTxn, signedPaymentTxn]

    return signedGroup
  } catch (error) {
    console.log("signTransactionsAcceptAndPayMnemonic API error: ", error)
    throw error
  }
}

export function signTransactionsAcceptAndPayPaid(params: any, mnemonicSecretKey: any, buyer: any, assetId: any) {
  try {

    const txnOptin = algosdk.makeAssetTransferTxnWithSuggestedParams(buyer, buyer, undefined, undefined, 0, undefined, assetId, params)
    console.log("signTransactionsAcceptAndPayPaid txnOptin: ", txnOptin)

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    let signedOptinTxn = algosdk.signTransaction(txnOptin, secret_key.sk)
    signedOptinTxn.blob = signedOptinTxn.blob.toString()

    return [signedOptinTxn]
  } catch (error) {
    console.log("signTransactionsAcceptAndPayPaid API error: ", error)
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

export const algorandSendAcceptAndPayTx = async (sow: any, tx: any) => {
  const mutation = loader('../graphql/algorandSendAcceptAndPayTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, tx: tx }))
    console.log("algorandSendAcceptAndPayTx result: ", result)
    return result.data.algorandSendAcceptAndPayTx
  } catch (error) {
    console.log("algorandSendAcceptAndPayTx API error: ", error)
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
    // const rawSignedCreationTxn = creationTxn.signTxn(secret_key.sk);
    let signedCreationTxn = algosdk.signTransaction(creationTxn, secret_key.sk)
    signedCreationTxn.blob = signedCreationTxn.blob.toString()
    // console.log("signTxn signedCreationTxn: ", signedCreationTxn)

    return signedCreationTxn
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

export function mnemonicToSecretKey(mnemonicSecretKey: any) {
  try {
    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    // console.log("mnemonicToSecretKey secret_key: ", secret_key)

    return secret_key
  } catch (error) {
    console.log("mnemonicToSecretKey API error: ", error)
    throw error
  }
}

export const destroyAndCreateAsset = async (mnemonicSecretKey: any, addr: any, note: any, assetID: any, params: any,
  totalIssuance: any, decimals: any, defaultFrozen: any, manager: any, reserve: any, freeze: any, clawback: any, unitName: any, assetName: any, assetURL: any, assetMetadataHash: any) => {
  try {

    const destroyTxn = algosdk.makeAssetDestroyTxnWithSuggestedParams(addr, note, assetID, params);
    // console.log("destroyAndCreateAsset destroyTxn: ", destroyTxn);

    const creationTxn = algosdk.makeAssetCreateTxnWithSuggestedParams(
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
    // console.log("destroyAndCreateAsset creationTxn: ", creationTxn);

    let gid = algosdk.assignGroupID([destroyTxn, creationTxn]);

    const secret_key = algosdk.mnemonicToSecretKey(mnemonicSecretKey);
    let signedDestroyTxn = algosdk.signTransaction(destroyTxn, secret_key.sk)
    signedDestroyTxn.blob = signedDestroyTxn.blob.toString()
    let signedCreationTxn = algosdk.signTransaction(creationTxn, secret_key.sk)
    signedCreationTxn.blob = signedCreationTxn.blob.toString()
    const signedGroup = [signedDestroyTxn, signedCreationTxn]

    return signedGroup
  } catch (error) {
    console.log("destroyAndCreateAsset error: ", error)
    throw error
  }
}

export const algorandSendDeliverableTokenCreationTx = async (sow: any, tx: any) => {
  const mutation = loader('../graphql/algorandSendDeliverableTokenCreationTx.gql')

  try {
    const result: any = await API.graphql(graphqlOperation(mutation, { sow: sow, tx: tx }))
    console.log("algorandSendDeliverableTokenCreationTx result: ", result)
    return result.data.algorandSendDeliverableTokenCreationTx
  } catch (error) {
    console.log("algorandSendDeliverableTokenCreationTx API error: ", error)
    throw error
  }
}