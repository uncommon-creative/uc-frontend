import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { ActivityButton } from '../common/ActivityButton';

export const AcceptMilestone = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const users = useSelector(ProfileSelectors.getUsers)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const signedMsig = useSelector(TransactionSelectors.getSignedMsig)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const params = useSelector(TransactionSelectors.getParams)

  React.useEffect(() => {

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
            <ActivityButton data-cy='continueTransaction' disabled={!acceptedConditions} name="willGetSignedMsig" color="primary" onClick={() => {
              dispatch(TransactionActions.willGetSignedMsig({sow: currentSow.sow}))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Accept milestone</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are accepting the milestone approving the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "deliverable").downloadUrl}>deliverable</a> as the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            {/* <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000}</CardSubtitle> */}

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
              dispatch(TransactionActions.goToTransactionPage(1))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptMilestoneMnemonic' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionAcceptMilestoneMnemonic" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptMilestoneMnemonic({ signedMsig: signedMsig, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Transaction completed</ModalHeader>
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
            <ActivityButton data-cy='closeAcceptMilestone' name="closeAcceptMilestone" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 4 &&
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
    </Modal>
  )
}