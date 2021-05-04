import * as React from 'react';
import {
  Card, CardBody, CardText,
  CardTitle, CardSubtitle,
  Container, Jumbotron,
  Label, FormGroup, Input,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { actions as ProfileActions, selectors as ProfileSelectors } from '../store/slices/profile'
import { ActivityButton } from '../components/common/ActivityButton'
import { selectors as UISelectors } from '../store/slices/ui'

const algosdk = require('algosdk');

export const CreateAlgoAccountPage = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isLoading = useSelector(UISelectors.isLoading)
  let history = useHistory();
  const algoAccount = useSelector(ProfileSelectors.getAlgoAccount)
  const algoAccountWords = algosdk.secretKeyToMnemonic(algoAccount.sk)

  const [mnemonicSaved, setMnemonicSaved] = React.useState(false);

  return (
    <>
      {!isLoading &&
        <Container>
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="text-center">Create Algo Account Page</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hints:</CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted text-center">On the first login was created the following algo account to use</CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted text-center">The mnemonic secret key will be showed only once, safe it offline</CardSubtitle>

              <Label for="algoAddr">Public Address:</Label>
              <Jumbotron>
                <CardText name="algoAddr">{algoAccount.addr}</CardText>
              </Jumbotron>
              <Label for="MnemonicSecretKey">Mnemonic secret key (to safe offline):</Label>
              <Jumbotron>
                <CardText name="MnemonicSecretKey">{algoAccountWords}</CardText>
              </Jumbotron>

              <FormGroup check>
                <Label check>
                  <Input name="mnemonicSaved" id="mnemonicSaved" type="checkbox"
                    onChange={(event) => setMnemonicSaved(event.target.checked)}
                  />
                    I saved the mnemonic secret key offline
                  </Label>
              </FormGroup>
              <ActivityButton type="submit" name="savePublicAddress" color="primary" block disabled={!mnemonicSaved}
                onClick={() => {
                  dispatch(ProfileActions.willAddPublicKey({ publicKey: algoAccount.addr, history: history }))
                }}>Save public address</ActivityButton>
            </CardBody>
          </Card>
        </Container>
      }
    </>
  )
}