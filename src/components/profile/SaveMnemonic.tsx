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
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../../store/slices/assetCurrency'
import { actions as ChatActions } from '../../store/slices/chat'
import { selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { actions as TransactionActions, selectors as TransactionSelectors, AlgorandFee } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as UIActions } from '../../store/slices/ui'
import { selectors as ProfileSelectors, actions as ProfileActions } from '../../store/slices/profile'
import { ActivityButton } from '../common/ActivityButton';
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const SaveMnemonicModal = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const saveMnemonic = useSelector(ProfileSelectors.getSaveMnemonic)
  const error = useSelector(AssetCurrencySelectors.getError)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const params = useSelector(TransactionSelectors.getParams)
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)

  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const [password, setPassword] = React.useState('');

  const toggleSaveMnemonicModal = () => dispatch(ProfileActions.willToggleSaveMnemonicModal())

  React.useEffect(() => {
    saveMnemonic.modalOpen && dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 1 }))

    return () => {
      setMnemonicSecretKey('')
      setPassword('')
      dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 0 }))
    }
  }, [saveMnemonic.modalOpen])

  return (
    <Modal isOpen={saveMnemonic.modalOpen} toggle={toggleSaveMnemonicModal} size="xl" backdrop={"static"} scrollable={true}>
      {saveMnemonic.modalPage == 0 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Save encrypted mnemonic secret key</ModalHeader>
          <ModalBody className="text-center">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {saveMnemonic.modalPage == 1 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Save encrypted mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Do you want to save your mnemonic secret key encrypted with a password chosen by you in the local storage of the current browser?</CardSubtitle>
            {/* <FormGroup>
              <Label for="mnemonicSecretKey">Mnemonic Secret Key *</Label>
              <Input value={mnemonicSecretKey} type="textarea" name="mnemonicSecretKey" id="mnemonicSecretKey" placeholder="mnemonicSecretKey"
                onChange={(event: any) => {
                  setMnemonicSecretKey(event.target.value)
                }}
              />
            </FormGroup> */}
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="noSaveMnemonic" outline color="primary" onClick={() => {
              dispatch(ProfileActions.willToggleSaveMnemonicModal())
            }}>No</ActivityButton>
            <ActivityButton name="yesSaveMnemonic" color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 2 }))

              // dispatch(AssetCurrencyActions.willOptinAssetCurrency({ params: params, mnemonicSecretKey: mnemonicSecretKey, address: userAttributes.public_key, assetId: currentAssetCurrency, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' }))
            }}>Yes</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 2 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Insert your mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are saving your mnemonic secret key encrypted with a password chosen by you in the local storage of the current browser.</CardSubtitle>
            <FormGroup>
              <Label for="mnemonicSecretKey">Mnemonic Secret Key *</Label>
              <Input value={mnemonicSecretKey} type="textarea" name="mnemonicSecretKey" id="mnemonicSecretKey" placeholder="mnemonicSecretKey"
                onChange={(event: any) => {
                  setMnemonicSecretKey(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="cancelSaveMnemonic" outline color="primary"
              onClick={toggleSaveMnemonicModal}
            >Cancel</ActivityButton>
            <ActivityButton disabled={mnemonicSecretKey == ''} name="willOptinAssetCurrency" color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 3 }))
              // dispatch(AssetCurrencyActions.willOptinAssetCurrency({ params: params, mnemonicSecretKey: mnemonicSecretKey, address: userAttributes.public_key, assetId: currentAssetCurrency, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 3 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Insert a password chosen by you</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are saving your mnemonic secret key encrypted with a password chosen by you in the local storage of the current browser.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">This password is chosen by you and it is not possible to recover.</CardSubtitle>
            <FormGroup>
              <Label for="password">Password *</Label>
              <Input value={password} type="textarea" name="password" id="password" placeholder="password"
                onChange={(event: any) => {
                  setPassword(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="cancelSaveMnemonic" outline color="primary"
              onClick={toggleSaveMnemonicModal}
            >Cancel</ActivityButton>
            <ActivityButton disabled={password == ''} name="willOptinAssetCurrency" color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 4 }))
              // dispatch(AssetCurrencyActions.willOptinAssetCurrency({ params: params, mnemonicSecretKey: mnemonicSecretKey, address: userAttributes.public_key, assetId: currentAssetCurrency, toPayAlgo: AlgorandFee / 1000000, currency: 'ALGO' }))
            }}>Complete</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 4 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Mnemonic saved</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                The encrypted mnemonic secret key was saved in the local storage of the current browser.
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeOptin" color="primary" onClick={toggleSaveMnemonicModal}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 5 &&
        <>
          <ModalHeader toggle={toggleSaveMnemonicModal}>Mnemonic saved</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                Inexpected error, please retry.
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggleSaveMnemonicModal}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal >
  )
}