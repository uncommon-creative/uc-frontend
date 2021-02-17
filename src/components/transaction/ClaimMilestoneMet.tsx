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
import { ActivityButton } from '../ActivityButton';

export const ClaimMilestoneMet = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const users = useSelector(ProfileSelectors.getUsers)
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
      dispatch(TransactionActions.cancelTransaction())
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
              dispatch(TransactionActions.willCreateMultiSigAddress({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Claim milestone met</ModalHeader>
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
            <ActivityButton data-cy='willSignTransactionClaimMilestoneMet' disabled={mnemonicSecretKey == ''} name="willSignTransactionClaimMilestoneMet" color="primary" onClick={async () => {
              dispatch(TransactionActions.willSignTransactionClaimMilestoneMet({ multiSigAddress: multiSigAddress, sellerAddress: users[currentSow.seller].public_key, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow }))
            }}>Sign the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Transaction signed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress}</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionSigned')}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {/* {transactionPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Transaction failed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSigAddress}</CardSubtitle>
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
      } */}
    </Modal>
  )
}