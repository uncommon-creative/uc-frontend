import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../store/slices/transaction'
import { ActivityButton } from './ActivityButton';

export const AcceptSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSigAddress = useSelector(TransactionSelectors.getMultiSigAddress)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator }))
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Accept the conditions</ModalHeader>
          <ModalBody>
            <Jumbotron name="conditions" id="conditions">
              <CardText name="algoAddr">{t('conditions')}</CardText>
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
              dispatch(TransactionActions.willCreateMultiSigAddress({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress}</CardSubtitle>

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
            <ActivityButton data-cy='cancelTransaction' name="cancelTransaction" outline color="primary" onClick={() => {
              dispatch(TransactionActions.cancelTransaction())
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransaction' disabled={mnemonicSecretKey == ''} name="willCompleteTransaction" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransaction({ multiSigAddress: multiSigAddress, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Wallet funded</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress}</CardSubtitle>
            <Jumbotron>
              <CardText>
                The wallet was funded successfully
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