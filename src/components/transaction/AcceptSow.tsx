import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faKey, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import qrcode from 'qrcode-generator';

import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../../store/slices/chat'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as UIActions } from '../../store/slices/ui'
import { ActivityButton } from '../common/ActivityButton';

declare var AlgoSigner: any;

export const AcceptSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)
  const payment = useSelector(TransactionSelectors.getPayment)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)
  const [currentFromAlgoSigner, setCurrentFromAlgoSigner] = React.useState('');

  const typeNumber: TypeNumber = 4;
  const errorCorrectionLevel: ErrorCorrectionLevel = 'L';
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.make();
  const [qrImg, SetQrImg] = React.useState(qr.createDataURL(10, 1));

  // let completeTxnAPAlgoSigner = async () => {
  //   let paramsAlgoSigner = await AlgoSigner.algod({
  //     ledger: 'TestNet',
  //     path: '/v2/transactions/params',
  //   });
  //   console.log("paramsAlgoSigner: ", paramsAlgoSigner)

  //   const txn = {
  //     "from": currentFromAlgoSigner,
  //     "to": multiSig.address,
  //     "fee": paramsAlgoSigner.fee,
  //     "type": 'pay',
  //     "amount": payment.toPay,
  //     "firstRound": paramsAlgoSigner['last-round'],
  //     "lastRound": paramsAlgoSigner['last-round'] + 1000,
  //     "genesisID": paramsAlgoSigner['genesis-id'],
  //     "genesisHash": paramsAlgoSigner['genesis-hash'],
  //     "note": new Uint8Array(0)
  //   };

  //   console.log("in algoSign txn: ", txn)
  //   let result = await AlgoSigner.sign(txn)
  //   console.log("algoSign result: ", result);
  // }

  const subscribeOnAmountChecked = () => {
    const subscription = loader('../../graphql/onAmountChecked.gql')
    console.log("in onAmountChecked id: ", currentSow.sow)

    const result: any = (API.graphql(graphqlOperation(subscription, { id: currentSow.sow })) as any)
      .subscribe({
        next: ({ provider, value }: any) => {
          console.log("onAmountChecked received subscribe with ", value);

          if (value.data.onAmountChecked.status === "AMOUNT_OK") {
            console.log("onAmountChecked value success: ", value)
            dispatch(TransactionActions.willSetSowArbitrator({ sow: currentSow.sow, arbitrator: currentSow.arbitrator }))
            dispatch(TransactionActions.didCompleteTransactionAcceptAndPayQR(value.data))
          }
          else if (value.data.onAmountChecked.status === "AMOUNT_NOT_OK") {
            console.log("onAmountChecked value fail: ", value)
            dispatch(TransactionActions.didCompleteTransactionAcceptAndPayQRFail("Not enough balance on the wallet."))
            dispatch(NotificationActions.willShowNotification({ message: "Not enough balance on the wallet", type: "danger" }));
          }

          dispatch(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayQR'));
          dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
        }
      });
  }

  React.useEffect(() => {
    if (multiSig.address) {
      qr.addData(multiSig.address);
      qr.make();
      SetQrImg(qr.createDataURL(10, 1))
    }
  }, [multiSig])

  const [isAlgoSignInstalled, setAlgo] = React.useState(false);
  React.useEffect(() => {
    if (transactionPage == 2) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator }))

    return () => {
      setAcceptedConditions(false)
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage(1))
    }
  }, [modal])

  React.useEffect(() => {
    //if (transactionPage ==// 3) {
      transactionPage == 3 && subscribeOnAmountChecked()
    //}
  }, [transactionPage])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Accept the conditions</ModalHeader>
          <ModalBody>
            <Jumbotron name="conditions" id="conditions">
              <CardText name="transactionConditions">{t('transaction.conditions')}</CardText>
            </Jumbotron>
            <FormGroup check>
              <Label check>
                <Input data-cy="acceptConditions" checked={acceptedConditions} name="acceptConditions" id="acceptConditions" type="checkbox"
                  onChange={(event) => setAcceptedConditions(event.target.checked)}
                />Accept conditions *
              </Label>
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='continueTransaction' disabled={!acceptedConditions} name="continueTransaction" color="primary" onClick={() => {
              dispatch(TransactionActions.willCreateMultiSigAddress({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator, price: currentSow.price }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Choose the payment method</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Balances: {payment.balances / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Price: {payment.price / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Fee: {payment.fee / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Total: {payment.total / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">To pay: {payment.toPay / 1000000} ALGO</CardSubtitle>

            {payment.toPay > 0 &&
              <Row>
                <Col>
                  <Card className="flex-fill" outline onClick={() => {
                    dispatch(TransactionActions.willCompleteTransactionAcceptAndPayQR({ multiSigAddress: multiSig.address, toPay: payment.toPay, currentSow: currentSow }))
                  }}>
                    <CardBody className="text-center">
                      <CardSubtitle tag="h5" className="mb-2 text-muted text-center">QR</CardSubtitle>
                      <FontAwesomeIcon icon={faQrcode} size="5x" />
                    </CardBody>
                  </Card>
                </Col>
                <Col>
                  <Card className="flex-fill" onClick={() => {
                    dispatch(TransactionActions.goToTransactionPage(4))
                  }}>
                    <CardBody className="text-center">
                      <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                      <FontAwesomeIcon icon={faKey} size="5x" />
                    </CardBody>
                  </Card>
                </Col>
                <Col>
                  <Card className="flex-fill" disabled onClick={() => {
                    isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareTransactionAcceptAndPayAlgoSigner())
                      : dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }));
                  }}>
                    <CardBody className={isAlgoSignInstalled ? "text-center" : "text-center text-muted"}>
                      <CardSubtitle tag="h5" className="mb-2 text-muted text-center">AlgoSigner</CardSubtitle>
                      {!isAlgoSignInstalled && <CardSubtitle tag="h6" className="mb-2 text-muted text-center">(not installed)</CardSubtitle>}
                      <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            }
          </ModalBody>
          {payment.toPay <= 0 &&
            <ModalFooter>
              <ActivityButton data-cy='continueTransaction' disabled={!acceptedConditions} name="continueTransaction" color="primary" onClick={() => {
                dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.ACCEPT_AND_PAY }, sow: currentSow }));
                dispatch(TransactionActions.willSetSowArbitrator({ sow: currentSow.sow, arbitrator: currentSow.arbitrator }))
                dispatch(TransactionActions.goToTransactionPage(6))
              }}>Complete</ActivityButton>
            </ModalFooter>
          }
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with QR</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Balances: {payment.balances / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Price: {payment.price / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Fee: {payment.fee / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Total: {payment.total / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">To pay: {payment.toPay / 1000000} ALGO</CardSubtitle>

            <div style={{ textAlign: 'center' }} id="qrCode">
              <img
                key={Date.now()}
                src={qrImg}
                id="accountQR"
                style={{
                  padding: '0.5em',
                  margin: '0.5em',
                  border: '1px solid #9095AF',
                  borderRadius: '10px'
                }}
                width="250"
                height="250"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayQR' name="willCompleteTransactionAcceptAndPayQR" color="primary" onClick={async () => {
              // dispatch(TransactionActions.willCompleteTransactionAcceptAndPayQR({ multiSigAddress: multiSig.address, toPay: payment.toPay, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Balances: {payment.balances / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Price: {payment.price / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Fee: {payment.fee / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Total: {payment.total / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">To pay: {payment.toPay / 1000000} ALGO</CardSubtitle>

            <FormGroup>
              <Label for="mnemonicSecretKey">Mnemonic Secret Key *</Label>
              <Input data-cy="mnemonicSecretKey" value={mnemonicSecretKey} type="textarea" name="mnemonicSecretKey" id="mnemonicSecretKey" placeholder="mnemonicSecretKey"
                onChange={(event: any) => {
                  setMnemonicSecretKey(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayMnemonic' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionAcceptAndPayMnemonic" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic({ multiSigAddress: multiSig, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow, toPay: payment.toPay }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 5 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with AlgoSigner</ModalHeader>
          <ModalBody className="text-center">
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Balances: {payment.balances / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Price: {payment.price / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Fee: {payment.fee / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">Total: {payment.total / 1000000} ALGO</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2">To pay: {payment.toPay / 1000000} ALGO</CardSubtitle>

            {algoSigner.accounts.map((element: any, index: any) => {
              return (
                <ListGroupItem className={currentFromAlgoSigner == element.address ? 'border border-primary' : 'border'}
                  onClick={() => {
                    console.log("select currentFromAlgoSigner: ", element.address)
                    setCurrentFromAlgoSigner(element.address)
                  }}
                >{element.address}</ListGroupItem>
              )
            })}
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayAlgoSigner' disabled={currentFromAlgoSigner == ''} name="willCompleteTransactionAcceptAndPayAlgoSigner" color="primary"
              onClick={//completeTxnAPAlgoSigner
                () => {
                  dispatch(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner({ from: currentFromAlgoSigner, multiSigAddress: multiSig.address, params: params, toPay: payment.toPay }))
                }
              }
            >Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage == 6 &&
        <>
          <ModalHeader toggle={toggle}>Wallet funded</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000} ALGO</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionCompleted')}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage == 7 &&
        <>
          <ModalHeader toggle={toggle}>Transaction failed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000} ALGO</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionFailed', { errorMessage: transactionError })}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal >
  )
}