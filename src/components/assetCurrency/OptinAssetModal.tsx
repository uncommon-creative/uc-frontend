import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../../store/slices/assetCurrency'
import { actions as TransactionActions, selectors as TransactionSelectors, AlgorandFee } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../../store/slices/profile'
import { selectors as AuthSelectors } from '../../store/slices/auth'
import { SaveMnemonicModal } from '../profile/SaveMnemonic'
import { ActivityButton } from '../common/ActivityButton';
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'
import AlgoSignerLogo from '../../images/AlgoSigner.png'

declare var AlgoSigner: any;
const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const OptinAssetModal = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const user = useSelector(AuthSelectors.getUser)
  let saveMnemonicLS: any = localStorage.getItem('saveMnemonic')
  let saveMnemonicParsed = saveMnemonicLS ? JSON.parse(saveMnemonicLS) : undefined
  const saveMnemonicMy = saveMnemonicParsed ? saveMnemonicParsed[user.username] : undefined
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const modalPage = useSelector(AssetCurrencySelectors.getModalPage)
  const currentAssetCurrency = useSelector(AssetCurrencySelectors.getCurrentAssetCurrency)
  const optinResult = useSelector(AssetCurrencySelectors.getOptinResult)
  const error = useSelector(AssetCurrencySelectors.getError)
  const params = useSelector(TransactionSelectors.getParams)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)

  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const [passphrase, setPassphrase] = React.useState('');
  const [saveMnemonicAsk, setSaveMnemonicAsk] = React.useState(false);
  const [isAlgoSignInstalled, setAlgo] = React.useState(false);

  React.useEffect(() => {
    if (modalPage == 1) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [modalPage]);

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ sowCommand: "OptinAssetCurrency" }))

    return () => {
      setMnemonicSecretKey('')
      dispatch(AssetCurrencyActions.goToModalPage({ modalPage: 0 }))
    }
  }, [modal])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      {modalPage == 0 &&
        <>
          <ModalHeader toggle={toggle}>Opt-in asset</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {modalPage == 1 &&
        <>
          <ModalHeader toggle={toggle}>Choose the method to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are explicitly opt-in to receive the asset <a target="_blank" href={configuration[stage].AlgoExplorer_link["asset"] + currentAssetCurrency}>{currentAssetCurrency}</a>.</CardSubtitle>

            <Row>
              <Col>
                <Card onClick={() => {
                  dispatch(AssetCurrencyActions.goToModalPage({ modalPage: 2 }))
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
      {modalPage == 2 &&
        <>
          <ModalHeader toggle={toggle}>Sign with mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are explicitly opt-in to receive the asset <a target="_blank" href={configuration[stage].AlgoExplorer_link["asset"] + currentAssetCurrency}>{currentAssetCurrency}</a>.</CardSubtitle>
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
                  dispatch(AssetCurrencyActions.goToModalPage({ modalPage: 1 }))
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
            <ActivityButton name="goToModalPage" outline color="primary" onClick={() => {
              dispatch(AssetCurrencyActions.goToModalPage({ modalPage: 1 }))
            }}>Cancel</ActivityButton>
            <ActivityButton disabled={(mnemonicSecretKey == '' && passphrase == '')} name="willOptinAssetCurrency" color="primary" onClick={async () => {
              saveMnemonicAsk && dispatch(ProfileActions.willToggleSaveMnemonicModal())
              dispatch(AssetCurrencyActions.willOptinAssetCurrency({ params: params, mnemonicSecretKey: mnemonicSecretKey, passphrase: passphrase, saveMnemonic: saveMnemonicMy, address: userAttributes.public_key, assetId: currentAssetCurrency, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' }))
            }}>Sign</ActivityButton>
          </ModalFooter>
        </>
      }
      {/* {modalPage == 3 &&
        <>
          <ModalHeader toggle={toggle}>Sign with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-3 text-muted text-center">You are signing the quote and committing to provide the service as described in the <a target="_blank" href={worksAgreementPdf.downloadUrl}>works agreement</a>.</CardSubtitle>

            <ListGroupItem className='border border-primary bg-light'>
              {algoSigner.account.address + ': ' + t('transaction.payment.algo', { value: algoSigner.account.amount / 1000000 })}
            </ListGroupItem>

          </ModalBody>
          <ModalFooter>
            <ActivityButton name="goToModalPage" outline color="primary" onClick={() => {
              dispatch(AssetCurrencyActions.goToModalPage({ modalPage: 1 }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionSubmitAlgoSigner' name="willCompleteTransactionSubmitAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionSubmitAlgoSigner({ params: params, account: algoSigner.account, currentSow: currentSow, pdfHash: worksAgreementPdf.pdfHash }))
              }}
            >Complete the signature</ActivityButton>
          </ModalFooter>
        </>
      } */}
      {modalPage == 4 &&
        <>
          <ModalHeader toggle={toggle}>Opt-in completed</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                The Opt-in was completed.
              </CardText>
              <CardText>
                <LinkBlockExplorer title={'Asset: ' + currentAssetCurrency} type="asset" id={currentAssetCurrency} />
                <LinkBlockExplorer title={'Transaction: ' + optinResult.tx.substring(0, 6) + '...'} type="tx" id={optinResult.tx} />
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeOptin" color="primary" tag={Link} to={`/home`}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {modalPage == 5 &&
        <>
          <ModalHeader toggle={toggle}>Opt-in failed</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionFailed', { errorMessage: error })}
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