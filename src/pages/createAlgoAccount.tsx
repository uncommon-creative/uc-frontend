import * as React from 'react';
import {
  Card, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row, Jumbotron, CardText
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";

import { actions as ProfileActions, selectors as ProfileSelectors } from '../store/slices/profile'
import { ActivityButton } from '../components/ActivityButton'

const algosdk = require('algosdk');

export const CreateAlgoAccountPage = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const algoAccount = useSelector(ProfileSelectors.getAlgoAccount)
  let account = algosdk.generateAccount();
  const algoAccountWords = algosdk.secretKeyToMnemonic(account.sk)

  return (
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
          <ActivityButton type="submit" name="savePublicAddress" color="primary" block
            onClick={() => dispatch(ProfileActions.willAddPublicKey({ publicKey: algoAccount.addr, history: history }))}
          >Save public address</ActivityButton>
        </CardBody>
      </Card>
    </Container >
  )
}