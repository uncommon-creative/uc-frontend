import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Spinner, Card, CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../../store/slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { selectors as AuthSelectors } from '../../store/slices/auth'
import { SaveMnemonicModal } from '../profile/SaveMnemonic'
import { ActivityButton } from '../common/ActivityButton';
import AlgoSignerLogo from '../../images/AlgoSigner.png'

declare var AlgoSigner: any;

export const AcceptMilestone = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const user = useSelector(AuthSelectors.getUser)
  let saveMnemonic: any = localStorage.getItem('saveMnemonic')
  saveMnemonic = saveMnemonic ? JSON.parse(saveMnemonic)[user.username] : undefined
  const { t, i18n } = useTranslation();
  const users = useSelector(ProfileSelectors.getUsers)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const signedMsig = useSelector(TransactionSelectors.getSignedMsig)
  const transactionError = useSelector(TransactionSelectors.getError)
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const params = useSelector(TransactionSelectors.getParams)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)

  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [saveMnemonicAsk, setSaveMnemonicAsk] = React.useState(false);
  const [isAlgoSignInstalled, setAlgo] = React.useState(false);

  React.useEffect(() => {
    if (transactionPage[SowCommands.ACCEPT_MILESTONE] == 2) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  React.useEffect(() => {
    dispatch(TransactionActions.goToTransactionPage({ transactionPage: 1, sowCommand: SowCommands.ACCEPT_MILESTONE }))

    return () => {
      setAcceptedConditions(false)
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.ACCEPT_MILESTONE }))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 0 &&
        <>
          <ModalHeader toggle={toggle}>{t(`chat.SowCommands.${SowCommands.ACCEPT_MILESTONE}`)}</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 1 &&
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
              dispatch(TransactionActions.willGetSignedMsig({ sow: currentSow.sow }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Choose the method to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are accepting the milestone approving the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "deliverable").downloadUrl}>deliverable</a> as the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <Row>
              <Col>
                <Card data-cy='mnemonicAcceptMilestone' onClick={() => {
                  dispatch(TransactionActions.goToTransactionPage({ transactionPage: 3, sowCommand: SowCommands.ACCEPT_MILESTONE }))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card onClick={() => {
                  // isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareAlgoSigner({ sowCommand: SowCommands.ACCEPT_MILESTONE }))
                  //   : dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }))
                  dispatch(NotificationActions.willShowNotification({ message: "In development", type: "info" }));
                }}>
                  <CardBody className={isAlgoSignInstalled ? "text-center" : "text-center text-muted"}>
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">AlgoSigner (in development)</CardSubtitle>
                    {!isAlgoSignInstalled && <CardSubtitle tag="h6" className="mb-2 text-muted text-center">(not installed)</CardSubtitle>}
                    <img src={AlgoSignerLogo} height="80" alt="AlgoSigner Logo" />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 3 &&
        <>
          <ModalHeader toggle={toggle}>Accept milestone</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are accepting the milestone approving the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "deliverable").downloadUrl}>deliverable</a> as the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>

            {saveMnemonic && saveMnemonic.save ?
              <FormGroup>
                <Label for="passwordSaveMnemonic">Password *</Label>
                <Input value={password} type="password" name="passwordSaveMnemonic" id="passwordSaveMnemonic" placeholder="passwordSaveMnemonic"
                  onChange={(event: any) => {
                    setPassword(event.target.value)
                  }}
                />
              </FormGroup>
              :
              <>
                <FormGroup>
                  <Label for="mnemonicSecretKey">Mnemonic Secret Key *</Label>
                  <Input data-cy="mnemonicSecretKey" value={mnemonicSecretKey} type="textarea" name="mnemonicSecretKey" id="mnemonicSecretKey" placeholder="mnemonicSecretKey"
                    onChange={(event: any) => {
                      setMnemonicSecretKey(event.target.value)
                    }}
                  />
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input name="saveMnemonicAsk" id="saveMnemonicAsk" type="checkbox"
                      onChange={(event) => setSaveMnemonicAsk(event.target.checked)}
                    />
                      Save mnemonic in local storage for quick sign
                  </Label>
                </FormGroup>
              </>
            }
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.ACCEPT_MILESTONE }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptMilestoneMnemonic' disabled={(mnemonicSecretKey == '' && password == '')} name="willCompleteTransactionAcceptMilestoneMnemonic" color="primary" onClick={async () => {
              saveMnemonicAsk && dispatch(ProfileActions.willToggleSaveMnemonicModal())
              dispatch(TransactionActions.willCompleteTransactionAcceptMilestoneMnemonic({ signedMsig: signedMsig, mnemonicSecretKey: mnemonicSecretKey, password: password, saveMnemonic: saveMnemonic, currentSow: currentSow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 4 &&
        <>
          <ModalHeader toggle={toggle}>Sign with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are accepting the milestone approving the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "deliverable").downloadUrl}>deliverable</a> as the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>

            <ListGroupItem className='border border-primary bg-light'>
              {algoSigner.account.address + ': ' + t('transaction.payment.algo', { value: algoSigner.account.amount / 1000000 })}
            </ListGroupItem>

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.ACCEPT_MILESTONE }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptMilestoneAlgoSigner' name="willCompleteTransactionAcceptMilestoneAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionAcceptMilestoneAlgoSigner({ signedMsig: signedMsig, currentSow: currentSow }))
              }}
            >Complete the signature</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 5 &&
        <>
          <ModalHeader toggle={toggle}>Transaction completed</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionCompleted')}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='closeAcceptMilestone' name="closeAcceptMilestone" color="primary" onClick={() => {
              dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
              toggle()
            }
            }
            >Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_MILESTONE] == 6 &&
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

      <SaveMnemonicModal mnemonicSecretKeyProp={mnemonicSecretKey} />
    </Modal>
  )
}