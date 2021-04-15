import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { selectors as ChatSelectors } from '../../store/slices/chat'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { ActivityButton } from '../common/ActivityButton'
import { FileButton } from '../common/FileButton'
import { SowAttachmentsInput } from '../SowAttachmentsInput'
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'
import AlgoSignerLogo from '../../images/AlgoSigner.png'

declare var AlgoSigner: any;
const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const ClaimMilestoneMet = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const users = useSelector(ProfileSelectors.getUsers)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const messagesCommands = useSelector(ChatSelectors.getMessagesCommands)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const transactionClaimMilestoneMet = useSelector(TransactionSelectors.getTransactionClaimMilestoneMet)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)
  const newAttachments = useSelector(SowSelectors.getNewAttachments)

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParamsWithDelay({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))

    return () => {
      setAcceptedConditions(false)
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
    }
  }, [modal])

  const [isAlgoSignInstalled, setAlgo] = React.useState(false);
  React.useEffect(() => {
    if (transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 3) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 0 &&
        <>
          <ModalHeader toggle={toggle}>{t(`chat.SowCommands.${SowCommands.CLAIM_MILESTONE_MET}`)}</ModalHeader>
          <ModalBody className="text-center">
            <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 1 &&
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
            <ActivityButton data-cy='continueTransaction' disabled={!acceptedConditions} name="continueTransaction" color="primary" onClick={() => {
              dispatch(TransactionActions.willCreateMultiSigAddress({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentSow.arbitrator, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Upload the deliverable</ModalHeader>
          <ModalBody data-cy="attachmentDeliverableModal">
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Upload the deliverable as the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">As an alternative to a non-digital work, upload a final report of the work done.</CardSubtitle>
            <Formik
              initialValues={{}}
              onSubmit={() => { }}
            >
              <>
                <Label for="attachments">
                  Deliverable
                  <CardSubtitle className="fs-5 text-muted" style={{ fontSize: 12 }}>
                    Only one file allowed, create a compressed archive with multiple files if needed.
                  </CardSubtitle>
                </Label>
                <SowAttachmentsInput currentSow={currentSow} keyAttachment={configuration[stage].deliverable_key} />
              </>
            </Formik>
            {/* {newAttachments.length > 0 && newAttachments.some((file: any) => (file.filename == configuration[stage].deliverable_key || (file.owner == currentSow.sow && file.key != "01f4b372-8f44-4f8b-a2eb-64a2a3d33059/works_agreement.pdf"))) && */}
            {newAttachments.some((file: any) => (file.filename == configuration[stage].deliverable_key)) &&
              <ListGroupItem>
                <FileButton file={newAttachments.find((file: any) => file.filename == configuration[stage].deliverable_key)} />
              </ListGroupItem>
            }

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='continueTransaction' disabled={!(newAttachments.some((file: any) => file.filename == configuration[stage].deliverable_key))} name="completeTransaction" color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 3, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 3 &&
        <>
          <ModalHeader toggle={toggle}>Choose the method to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are claiming the milestone as met committing the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <Row>
              <Col>
                <Card data-cy='mnemonicClaimMilestoneMet' onClick={() => {
                  dispatch(TransactionActions.goToTransactionPage({ transactionPage: 4, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card onClick={() => {
                  isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareAlgoSigner({ sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
                    : dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }))
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
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 4 &&
        <>
          <ModalHeader toggle={toggle}>Claim milestone met with mnemonic Secret Key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are claiming the milestone as met committing the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000} ALGO</CardSubtitle>

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
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 3, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionClaimMilestoneMetMnemonic' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionClaimMilestoneMetMnemonic" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionClaimMilestoneMetMnemonic({ multiSigAddress: multiSig.address, params: params, mnemonicSecretKey: mnemonicSecretKey, currentSow: currentSow, hash: newAttachments.find((file: any) => file.filename == configuration[stage].deliverable_key).etag }))
            }}>Sign the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 5 &&
        <>
          <ModalHeader toggle={toggle}>Claim milestone met with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are claiming the milestone as met committing the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>

            <ListGroupItem className='border border-primary bg-light'>
              {algoSigner.account.address + ': ' + t('transaction.payment.algo', { value: algoSigner.account.amount / 1000000 })}
            </ListGroupItem>

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 3, sowCommand: SowCommands.CLAIM_MILESTONE_MET }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionClaimMilestoneMetAlgoSigner' name="willCompleteTransactionClaimMilestoneMetAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionClaimMilestoneMetAlgoSigner({ multiSigAddress: multiSig.address, params: params, currentSow: currentSow, hash: newAttachments.find((file: any) => file.filename == configuration[stage].deliverable_key).etag }))
              }}
            >Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 6 &&
        <>
          <ModalHeader toggle={toggle}>Transaction signed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000} ALGO</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionSigned')}

              </CardText>
              <CardText>
                <LinkBlockExplorer title={'Asset: ' + transactionClaimMilestoneMet.assetId} type="asset" id={transactionClaimMilestoneMet.assetId} />
                {transactionClaimMilestoneMet.tx && <LinkBlockExplorer title={'Transaction: ' + transactionClaimMilestoneMet.tx.substring(0, 6) + '...'} type="tx" id={transactionClaimMilestoneMet.tx} />}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeClaimMilestoneMet" name="closeClaimMilestoneMet" color="primary"
              onClick={() => {
                dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
                toggle()
              }
              }
            >Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.CLAIM_MILESTONE_MET] == 7 &&
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