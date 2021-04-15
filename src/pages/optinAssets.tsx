import * as React from 'react';
import {
  Card, CardBody, CardText, CardTitle, CardSubtitle, Button,
  Container, Label, Spinner,
  Col, Row, Jumbotron,
  ListGroup, ListGroupItem
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { configuration } from '../config'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../store/slices/assetCurrency'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../store/slices/transaction'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { OptinAssetModal } from '../components/assetCurrency/OptinAssetModal'
import { ActivityButton } from '../components/common/ActivityButton'
import { LinkBlockExplorer } from '../components/common/LinkBlockExplorer'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const OptinAssetPage = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  console.log("userAttributes:", userAttributes)
  const user = useSelector(AuthSelectors.getUser)
  const modalOpen = useSelector(AssetCurrencySelectors.getModalOpen)
  const assetsCurrencies = useSelector(AssetCurrencySelectors.getAssetsCurrencies)
  const currentAssetCurrency = useSelector(AssetCurrencySelectors.getCurrentAssetCurrency)
  const algorandAccountInfo = useSelector(TransactionSelectors.getAlgorandAccountInfo)

  // React.useEffect(() => {
  //   dispatch(TransactionActions.willGetAlgorandAccountInfo(userAttributes.public_key))
  // }, [userAttributes]);

  return (
    <>
      <Container>
        <Card>
          <CardTitle tag="h5" className="text-center">Opt-in Asset</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Select the asset to opt-in</CardSubtitle>

          <CardBody>
            <ListGroup>
              {assetsCurrencies.map((asset: any, index: any) => {
                return (
                  <ListGroupItem key={index}>
                    <Row className="d-flex flex-row justify-content-between">
                      <Col className="col-5">
                        <LinkBlockExplorer title={`${asset.assetName}: ${asset.assetIndex}`} type="asset" id={asset.assetIndex} />
                      </Col>
                      <Col className="col-auto ml-auto">
                        <ActivityButton disabled={algorandAccountInfo.assets.some((accountAsset: any) => (accountAsset["asset-id"] == asset.assetIndex))} name="optinAsset" color="primary" onClick={() => {
                          dispatch(AssetCurrencyActions.toggleModalOpen())
                          dispatch(AssetCurrencyActions.willSelectAssetCurrency({ asset: asset.assetIndex }))
                        }}>Opt-in {asset.assetName}</ActivityButton>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </CardBody>
        </Card>
      </Container>

      <OptinAssetModal modal={modalOpen} toggle={() => dispatch(AssetCurrencyActions.toggleModalOpen())} />
    </>
  )
}