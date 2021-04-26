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
import { faKey, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../../store/slices/profile'
import { selectors as AuthSelectors } from '../../store/slices/auth'
import { SaveMnemonicModal } from '../profile/SaveMnemonic'
import { ActivityButton } from '../common/ActivityButton';
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'
import AlgoSignerLogo from '../../images/AlgoSigner.png'

declare var AlgoSigner: any;

export const SubmitSow = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const user = useSelector(AuthSelectors.getUser)
  let saveMnemonicLS: any = localStorage.getItem('saveMnemonic')
  let saveMnemonicParsed = saveMnemonicLS ? JSON.parse(saveMnemonicLS) : undefined
  const saveMnemonicMy = saveMnemonicParsed ? saveMnemonicParsed[user.username] : undefined
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const submitToken = useSelector(TransactionSelectors.getSubmitToken)
  const transactionError = useSelector(TransactionSelectors.getError)
  const params = useSelector(TransactionSelectors.getParams)
  const worksAgreementPdf = useSelector(SowSelectors.getWorksAgreementPdf)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)

  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const [passphrase, setPassphrase] = React.useState('');
  const [saveMnemonicAsk, setSaveMnemonicAsk] = React.useState(false);
  const [isAlgoSignInstalled, setAlgo] = React.useState(false);

  React.useEffect(() => {
    if (transactionPage[SowCommands.SUBMIT] == 2) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentChosenArbitrator, sowCommand: SowCommands.SUBMIT }))

    return () => {
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.SUBMIT }))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      {transactionPage[SowCommands.SUBMIT] == 0 &&
        <>
          <ModalHeader toggle={toggle}>{t(`chat.SowCommands.${SowCommands.SUBMIT}`)}</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.SUBMIT] == 1 &&
        <>
          <ModalHeader toggle={toggle}>Submitting the Statement of Work</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.SUBMIT] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Choose the method to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center"><FontAwesomeIcon icon={faExclamationTriangle} size='1x' /> Be sure to have the buyer's approval about the selected arbitrator, price, etc.</CardSubtitle>
            <Row>
              <Col>
                <Card data-cy='mnemonicSubmit' onClick={() => {
                  dispatch(TransactionActions.goToTransactionPage({ transactionPage: 3, sowCommand: SowCommands.SUBMIT }))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card onClick={() => {
                  // isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareAlgoSigner({ sowCommand: SowCommands.SUBMIT }))
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
      {transactionPage[SowCommands.SUBMIT] == 3 &&
        <>
          <ModalHeader toggle={toggle}>Sign with mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>
            {saveMnemonicMy && saveMnemonicMy.save ?
              <>
                <FormGroup>
                  <Label for="passphrase">Passphrase *</Label>
                  <Input value={passphrase} type="password" name="passphrase" id="passphrase" placeholder="passphrase"
                    onChange={(event: any) => {
                      setPassphrase(event.target.value)
                    }}
                  />
                </FormGroup>
                <Button color="link" onClick={() => {
                  delete saveMnemonicParsed[user.username]
                  localStorage.setItem('saveMnemonic', JSON.stringify(saveMnemonicParsed))
                  dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.SUBMIT }))
                  dispatch(NotificationActions.willShowNotification({ message: "Passphrase deleted", type: "info" }));
                }}>Forgot passphrase? Delete passphrase and use mnemonic</Button>
              </>
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
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.SUBMIT }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionSubmitMnemonic' disabled={(mnemonicSecretKey == '' && passphrase == '')} name="willCompleteTransactionSubmitMnemonic" color="primary" onClick={async () => {
              saveMnemonicAsk && dispatch(ProfileActions.willToggleSaveMnemonicModal())
              dispatch(TransactionActions.willCompleteTransactionSubmitMnemonic({ params: params, mnemonicSecretKey: mnemonicSecretKey, passphrase: passphrase, saveMnemonic: saveMnemonicMy, currentSow: currentSow, pdfHash: worksAgreementPdf.pdfHash }))
            }}>Sign</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.SUBMIT] == 4 &&
        <>
          <ModalHeader toggle={toggle}>Sign with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>

            <ListGroupItem className='border border-primary bg-light'>
              {algoSigner.account.address + ': ' + t('transaction.payment.algo', { value: algoSigner.account.amount / 1000000 })}
            </ListGroupItem>

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.SUBMIT }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionSubmitAlgoSigner' name="willCompleteTransactionSubmitAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionSubmitAlgoSigner({ params: params, account: algoSigner.account, currentSow: currentSow, pdfHash: worksAgreementPdf.pdfHash }))
              }}
            >Complete the signature</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage[SowCommands.SUBMIT] == 5 &&
        <>
          <ModalHeader toggle={toggle} data-cy="sowSubmitSuccess">Statement of Work submitted</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                The Statement of Work was submitted successfully, the following asset was created.
              </CardText>
              <CardText>
                <LinkBlockExplorer title={'Asset: ' + submitToken.assetId} type="asset" id={submitToken.assetId} />
                <LinkBlockExplorer title={'Transaction: ' + submitToken.tx.substring(0, 6) + '...'} type="tx" id={submitToken.tx} />
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeSubmit" name="closeSubmit" color="primary" tag={Link} to={`/home`}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage[SowCommands.SUBMIT] == 6 &&
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

      <SaveMnemonicModal mnemonicSecretKeyProp={mnemonicSecretKey} />
    </Modal >
  )
}