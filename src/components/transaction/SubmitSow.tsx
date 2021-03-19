import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ChatActions } from '../../store/slices/chat'
import { selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as UIActions } from '../../store/slices/ui'
import { ActivityButton } from '../common/ActivityButton';
import { Payment } from './Payment'
import AlgoSignerLogo from '../../images/AlgoSigner.png'


declare var AlgoSigner: any;

export const SubmitSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const submitToken = useSelector(TransactionSelectors.getSubmitToken)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)
  const pdfHash = useSelector(SowSelectors.getPdfHash)
  const payment = useSelector(TransactionSelectors.getPayment)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)
  const [currentFromAlgoSigner, setCurrentFromAlgoSigner] = React.useState('');

  const [isAlgoSignInstalled, setAlgo] = React.useState(false);
  React.useEffect(() => {
    if (transactionPage == 2) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentChosenArbitrator }))

    return () => {
      setMnemonicSecretKey('')
      setCurrentFromAlgoSigner('')
      dispatch(TransactionActions.goToTransactionPage(0))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Submitting the Statement of Work</ModalHeader>
          <ModalBody className="text-center">
            <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Choose the sign method</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Card data-cy='mnemonicAcceptAndPay' onClick={() => {
                  dispatch(TransactionActions.goToTransactionPage(3))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card onClick={() => {
                  // isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareTransactionAcceptAndPayAlgoSigner({ sow: currentSow.sow, multiSigAddress: multiSig.address, total: payment.total }))
                  //   : 
                  dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }));
                }}>
                  <CardBody className={isAlgoSignInstalled ? "text-center" : "text-center text-muted"}>
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">AlgoSigner</CardSubtitle>
                    {!isAlgoSignInstalled && <CardSubtitle tag="h6" className="mb-2 text-muted text-center">(not installed)</CardSubtitle>}
                    <img src={AlgoSignerLogo} height="80" alt="AlgoSigner Logo" />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Sign with mnemonic secret key</ModalHeader>
          <ModalBody>

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
              dispatch(TransactionActions.willCompleteTransactionSubmitMnemonic({ params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow, pdfHash: pdfHash }))
            }}>Sign</ActivityButton>
          </ModalFooter>
        </>
      }
      {/* {transactionPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with AlgoSigner</ModalHeader>
          <ModalBody>
            <Payment />

            <CardSubtitle tag="h6" className="pt-5 text-muted text-center">Select one of your AlgoSigner accounts</CardSubtitle>
            {algoSigner.accounts.map((element: any, index: any) => {
              return (
                <ListGroupItem disabled={element.amount < payment.toPay} className={currentFromAlgoSigner == element.address ? 'border border-primary bg-light' : 'border'} key={index}
                  onClick={() => {
                    console.log("select currentFromAlgoSigner: ", element.address)
                    setCurrentFromAlgoSigner(element.address)
                  }}
                >
                  {element.address + ': ' + t('transaction.payment.algo', { value: element.amount / 1000000 })}
                </ListGroupItem>
              )
            })}
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayAlgoSigner' disabled={currentFromAlgoSigner == ''} name="willCompleteTransactionAcceptAndPayAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner({ from: currentFromAlgoSigner, multiSigAddress: multiSig.address, toPay: payment.toPay, sow: currentSow.sow }))
                // subscribeOnAmountChecked()
              }}
            >Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      } */}
      {
        transactionPage == 5 &&
        <>
          <ModalHeader toggle={toggle}>Statement of Work submitted</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                The Statement of work was submitted successfully: {submitToken}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeSubmit" name="closeSubmit" color="primary" tag={Link} to={`/home`}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage == 6 &&
        <>
          <ModalHeader toggle={toggle}>Transaction failed</ModalHeader>
          <ModalBody>
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