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

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../../store/slices/chat'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { ActivityButton } from '../common/ActivityButton';

export const Reject = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)

  React.useEffect(() => {

    return () => {
      dispatch(TransactionActions.goToTransactionPage(1))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Reject</ModalHeader>
          <ModalBody>
            <Jumbotron name="reject" id="reject">
              <CardText name="transactionConditions">{t('transaction.reject')}</CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
          <ActivityButton data-cy='cancel' name="cancel" outline color="primary" onClick={() => {
              toggle()
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy={"willReject"} name={"willReject"} color="primary" onClick={() => {
              dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.REJECT }, sow: currentSow }));
              dispatch(TransactionActions.willReject())
            }}>Reject</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Rejected</ModalHeader>
          <ModalBody>
            <Jumbotron>
            <CardText name="transactionConditions">{t('transaction.rejectCompleted')}</CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeReject" name="closeReject" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal>
  )
}