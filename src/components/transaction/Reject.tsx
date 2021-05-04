import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Spinner, Jumbotron, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

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
    dispatch(TransactionActions.goToTransactionPage({ transactionPage: 1, sowCommand: SowCommands.REJECT }))

    return () => {
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.REJECT }))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      {transactionPage[SowCommands.REJECT] == 0 &&
        <>
          <ModalHeader toggle={toggle}>{t(`chat.SowCommands.${SowCommands.REJECT}`)}</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.REJECT] == 1 &&
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
              dispatch(TransactionActions.willReject({ sowCommand: SowCommands.REJECT }))
            }}>Reject</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.REJECT] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Rejected</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText name="transactionConditions">{t('transaction.rejectCompleted')}</CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeReject" name="closeReject" color="primary" onClick={() => {
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