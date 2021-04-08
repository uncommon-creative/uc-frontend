import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../../store/slices/chat'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { ActivityButton } from '../common/ActivityButton';

export const RequestReview = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    dispatch(TransactionActions.goToTransactionPage({ transactionPage: 1, sowCommand: SowCommands.REQUEST_REVIEW }))

    return () => {
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.REQUEST_REVIEW }))
      setNotes('')
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {transactionPage[SowCommands.REQUEST_REVIEW] == 1 &&
        <>
          <ModalHeader toggle={toggle}>Request Review</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h5" className="pt-2 text-muted text-center">{t('transaction.requestReview')}</CardSubtitle>
            <CardSubtitle tag="h6" className="pt-2 text-muted text-center">Remaining number of possible review requests: {currentSow.numberReviews}</CardSubtitle>
            <FormGroup>
              <Label for="notes">Notes *</Label>
              <Input data-cy="notes" value={notes} type="textarea" name="notes" id="notes" placeholder="notes"
                onChange={(event: any) => {
                  setNotes(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='cancel' name="cancel" outline color="primary" onClick={() => {
              toggle()
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy="willRequestReview" disabled={notes == ''} name="willRequestReview" color="primary" onClick={() => {
              dispatch(TransactionActions.willRequestReview({ sow: currentSow.sow, notes: notes }));
            }}>Request Review</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.REQUEST_REVIEW] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Review requested</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>{t('transaction.requestReviewCompleted')}</CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeRequestReview" name="closeRequestReview" color="primary" onClick={() => {
              dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
              toggle()
            }
            }
            >Close</ActivityButton>
          </ModalFooter>
        </>
      }

    </Modal>
  )
}