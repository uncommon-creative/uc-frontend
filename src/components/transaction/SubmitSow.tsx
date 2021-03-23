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
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { ActivityButton } from '../common/ActivityButton';
import { Payment } from './Payment'
import AlgoSignerLogo from '../../images/AlgoSigner.png'


declare var AlgoSigner: any;

export const SubmitSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const submitToken = useSelector(TransactionSelectors.getSubmitToken)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)
  const worksAgreementPdf = useSelector(SowSelectors.getWorksAgreementPdf)
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
          <ModalHeader toggle={toggle}>Choose how to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>
            <Row>
              <Col>
                <Card data-cy='mnemonicSubmit' onClick={() => {
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
                  // isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareTransactionSubmitAlgoSigner())
                  //   : dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }));
                  dispatch(NotificationActions.willShowNotification({ message: "In development", type: "info" }));
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
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>
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
            <ActivityButton data-cy='willCompleteTransactionSubmitMnemonic' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionSubmitMnemonic" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionSubmitMnemonic({ params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow, pdfHash: worksAgreementPdf.pdfHash }))
            }}>Sign</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Sign with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">Select AlgoSigner accounts associated to your Uncommon Creative profile</CardSubtitle>
            {algoSigner.accounts.map((element: any, index: any) => {
              return (
                <ListGroupItem disabled={element.address != userAttributes.public_key} className={currentFromAlgoSigner == element.address ? 'border border-primary bg-light' : 'border'} key={index}
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
            <ActivityButton data-cy='willCompleteTransactionSubmitAlgoSigner' disabled={currentFromAlgoSigner == ''} name="willCompleteTransactionSubmitAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionSubmitAlgoSigner({ params: params, address: currentFromAlgoSigner, currentSow: currentSow, pdfHash: worksAgreementPdf.pdfHash }))
              }}
            >Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage == 5 &&
        <>
          <ModalHeader toggle={toggle} data-cy="sowSubmitSuccess">Statement of Work submitted</ModalHeader>
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
          <ModalHeader toggle={toggle}>Submission failed</ModalHeader>
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