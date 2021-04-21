import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { configuration } from '../../config'
import { selectors as ProfileSelectors, actions as ProfileActions } from '../../store/slices/profile'
import { ActivityButton } from '../common/ActivityButton'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const SaveMnemonicModal = ({ mnemonicSecretKeyProp }: any) => {

  const dispatch = useDispatch();
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const saveMnemonic = useSelector(ProfileSelectors.getSaveMnemonic)

  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState(mnemonicSecretKeyProp);
  const [password, setPassword] = React.useState('');

  const toggleSaveMnemonicModal = () => dispatch(ProfileActions.willToggleSaveMnemonicModal())

  React.useEffect(() => {
    console.log(" SaveMnemonicModal mnemonicSecretKey: ", mnemonicSecretKey)
    console.log(" SaveMnemonicModal mnemonicSecretKeyProp: ", mnemonicSecretKeyProp)
    setMnemonicSecretKey(mnemonicSecretKeyProp)
    if (saveMnemonic.modalOpen) {
      mnemonicSecretKey == '' ? dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 1 }))
        : dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 3 }))
    }

    return () => {
      setMnemonicSecretKey('')
      setPassword('')
      dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 0 }))
    }
  }, [saveMnemonic.modalOpen, mnemonicSecretKeyProp])

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
          <ModalHeader>Save encrypted mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Do you want to save your mnemonic secret key encrypted with a password chosen by you in the local storage of the current browser?</CardSubtitle>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="noSaveMnemonic" outline color="primary" onClick={() => {
              dispatch(ProfileActions.willSaveMnemonic({ save: false }))
            }}>No</ActivityButton>
            <ActivityButton name="yesSaveMnemonic" color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 2 }))
            }}>Yes</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 2 &&
        <>
          <ModalHeader>Insert your mnemonic secret key</ModalHeader>
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
            <ActivityButton name="cancelSaveMnemonic" outline color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 1 }))
            }}>Cancel</ActivityButton>
            <ActivityButton disabled={mnemonicSecretKey == ''} name="continueSaveMnemonicModal" color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 3 }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 3 &&
        <>
          <ModalHeader>Insert a password chosen by you</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are saving your mnemonic secret key encrypted with a password chosen by you in the local storage of the current browser.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">This password is chosen by you, it is not the password used to login and it is not possible to recover.</CardSubtitle>
            <FormGroup>
              <Label for="passwordSaveMnemonic">Password *</Label>
              <Input value={password} type="password" name="passwordSaveMnemonic" id="passwordSaveMnemonic" placeholder="passwordSaveMnemonic"
                onChange={(event: any) => {
                  setPassword(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="cancelSaveMnemonic" outline color="primary" onClick={async () => {
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 2 }))
            }}>Cancel</ActivityButton>
            <ActivityButton disabled={password == ''} name="willSaveMnemonic" color="primary" onClick={async () => {
              dispatch(ProfileActions.willSaveMnemonic({ save: true, mnemonicSecretKey: mnemonicSecretKey, password: password }))
            }}>Complete</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 4 &&
        <>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                {saveMnemonic.success}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeSaveMnemonicModal" color="primary" onClick={toggleSaveMnemonicModal}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {saveMnemonic.modalPage == 5 &&
        <>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                {saveMnemonic.error != '' ?
                  `Error: ${saveMnemonic.error}`
                  : "Unexpected error, please retry."
                }
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={async () => {
              setMnemonicSecretKey('')
              setPassword('')
              dispatch(ProfileActions.goToSaveMnemonicModalPage({ modalPage: 1 }))
            }}>Retry</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal >
  )
}