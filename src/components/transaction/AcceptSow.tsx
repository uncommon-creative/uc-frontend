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

import { actions as SowActions, selectors as SowSelectors } from '../../store/slices/sow'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { ActivityButton } from '../ActivityButton';

export const AcceptSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSigAddress = useSelector(TransactionSelectors.getMultiSigAddress)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator }))

    return () => {
      setAcceptedConditions(false)
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage(1))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Accept the conditions</ModalHeader>
          <ModalBody>
            <Jumbotron name="conditions" id="conditions">
              <CardText name="algoAddr">{t('transaction.conditions')}</CardText>
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
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>
            <Row>
              <Col>
                <Card className="flex-fill" outline onClick={() => {
                  dispatch(TransactionActions.willChoosePayment(3))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">QR</CardSubtitle>
                    <FontAwesomeIcon icon={faQrcode} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card className="flex-fill" onClick={() => {
                  dispatch(TransactionActions.willChoosePayment(4))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Seed</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card className="flex-fill" disabled onClick={() => {
                  // dispatch(TransactionActions.willChoosePayment(5))
                }}>
                  <CardBody className="text-center text-muted">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Algosigner</CardSubtitle>
                    <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with QR</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>


          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayQR' name="willCompleteTransactionAcceptAndPayQR" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptAndPayQR({ multiSigAddress: multiSigAddress }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with seed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>

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
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPaySeed' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionAcceptAndPaySeed" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptAndPaySeed({ multiSigAddress: multiSigAddress, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 5 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with Algosigner</ModalHeader>
          <ModalBody className="text-center">
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>

            <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage(2))
            }}>Cancel</ActivityButton>
            {/* <ActivityButton data-cy='willCompleteTransactionAcceptAndPaySeed' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionAcceptAndPaySeed" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptAndPaySeed({ multiSigAddress: multiSigAddress, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton> */}
          </ModalFooter>
        </>
      }
      {transactionPage == 6 &&
        <>
          <ModalHeader toggle={toggle}>Wallet funded</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>
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
      {transactionPage == 7 &&
        <>
          <ModalHeader toggle={toggle}>Transaction failed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSigAddress.amount/1000000}</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionFailed')}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal>
  )
}