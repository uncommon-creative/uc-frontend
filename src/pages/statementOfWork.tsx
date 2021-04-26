import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row, Tooltip, ListGroupItem, Jumbotron,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { configuration } from '../config'
import { actions as NotificationActions } from '../store/slices/notification'
import { actions as SowActions, selectors as SowSelectors, SowStatus, SowCommands } from '../store/slices/sow'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../store/slices/assetCurrency'
import { ChatSow } from '../components/ChatSow'
import { ArbitratorDetailXS } from '../components/arbitrator/ArbitratorDetailXS'
import { ActivityButton } from '../components/common/ActivityButton'
import { RefreshButton } from '../components/common/RefreshButton'
import { FileButton } from '../components/common/FileButton'
import { SowDetails } from '../components/sow/SowDetails'
import { SowSummary } from '../components/sow/SowSummary'
import { SowAttachments } from '../components/sow/SowAttachments'
import { AcceptAndPay } from '../components/transaction/AcceptAndPay'
import { ClaimMilestoneMet } from '../components/transaction/ClaimMilestoneMet'
import { AcceptMilestone } from '../components/transaction/AcceptMilestone'
import { Reject } from '../components/transaction/Reject'
import { RequestReview } from '../components/transaction/RequestReview'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const StatementOfWorkPage = () => {

  let { code }: any = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  console.log("in statementOfWorkPage currentSow: ", currentSow)
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const algorandAccount = useSelector(ProfileSelectors.getAlgorandAccount)
  const assetsCurrencies = useSelector(AssetCurrencySelectors.getAssetsCurrencies)
  const currentArbitrators = useSelector(SowSelectors.getCurrentArbitrators);
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const newAttachments = useSelector(SowSelectors.getNewAttachments)
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)
  const [modalOpenAcceptSow, setModalOpenAcceptSow] = React.useState(false);
  const [modalOpenClaimMilestoneMet, setModalOpenClaimMilestoneMet] = React.useState(false);
  const [modalOpenAcceptMilestone, setModalOpenAcceptMilestone] = React.useState(false);
  const [modalOpenReject, setModalOpenReject] = React.useState(false);
  const [modalOpenRequestReview, setModalOpenRequestReview] = React.useState(false);

  const toggleModalAcceptSow = () => setModalOpenAcceptSow(!modalOpenAcceptSow);
  const toggleModalClaimMilestoneMet = () => setModalOpenClaimMilestoneMet(!modalOpenClaimMilestoneMet);
  const toggleModalAcceptMilestone = () => setModalOpenAcceptMilestone(!modalOpenAcceptMilestone);
  const toggleModalReject = () => setModalOpenReject(!modalOpenReject);
  const toggleModalRequestReview = () => setModalOpenRequestReview(!modalOpenRequestReview);

  const [tooltipOpenAcceptAndPay, setTooltipOpenAcceptAndPay] = React.useState(false);
  const toggleAcceptAndPay = () => setTooltipOpenAcceptAndPay(!tooltipOpenAcceptAndPay);

  React.useEffect(() => {
    console.log("in statementOfWorkPage currentSow: ", currentSow)
    dispatch(SowActions.willGetSow({ sow: code, history: history }))


  }, [])

  React.useEffect(() => {
    currentSow.status == SowStatus.SUBMITTED && dispatch(ArbitratorActions.selectingOneArbitrator())

    if (currentSow.status == SowStatus.DRAFT && user.username == currentSow.buyer && !userAttributes.address) {
      history.push('/profile')
      dispatch(NotificationActions.willShowNotification({ message: "Please complete your profile in order to continue.", type: "info" }))
    }
  }, [currentSow])

  return (
    <>
      {Object.keys(currentSow).length &&
        <Container>
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col className="col-11">
                  <CardTitle tag="h5" className="text-center">{currentSow.title}</CardTitle>
                  {/* <CardSubtitle tag="h5" className="mb-3 text-muted text-center">{currentSow.title}</CardSubtitle> */}
                  {/* <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{currentSow.sow}</CardSubtitle> */}
                </Col>
                <Col className="col-1">
                  <RefreshButton data-cy='getSow' type="submit" name="getSow" color="primary"
                    onClick={() => {
                      console.log('in refreshSow with code: ', code)
                      dispatch(SowActions.willGetSow({ sow: code }))
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="col-lg-8 col-12">
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Chat</CardSubtitle>
                  <Jumbotron>
                    <ChatSow currentSow={currentSow} />
                  </Jumbotron>
                </Col>
                <Col className="col-lg-4 col-12">
                  <Row>
                    <Col className="col-12">
                      <SowSummary />
                    </Col>
                  </Row>
                  {/* {currentSow.status == SowStatus.SUBMITTED && currentSow.buyer == user.username &&
                    <Row>
                      <Col className="col-12">
                        <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Arbitrators</CardSubtitle>
                        <Jumbotron>
                          {currentArbitrators.map((element: any, index: any) => {
                            return (
                              <ListGroupItem data-cy={`selectArbitrator${element.given_name}`} className={currentChosenArbitrator == element.user ? 'border border-primary bg-light' : 'border'} key={index}
                                onClick={() => {
                                  console.log("selecting arbitrator: ", element)
                                }}>
                                <ArbitratorDetailXS arbitrator={element} index={index} />
                              </ListGroupItem>
                            )
                          })}
                        </Jumbotron>
                      </Col>
                    </Row>
                  } */}
                  {(currentSow.status != SowStatus.DRAFT && currentSow.status != SowStatus.REJECTED && currentSow.status != SowStatus.EXPIRED && currentSow.status != SowStatus.MILESTONE_ACCEPTED && currentSow.status != SowStatus.SYSTEM_SIGNED) &&
                    <Row>
                      <Col className="col-12">
                        <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Special commands</CardSubtitle>
                        <Jumbotron>
                          {currentSow.arbitrator && currentSow.status == SowStatus.DISPUTED &&
                            <CardText className="text-muted text-center">
                              {t('chat.emptyComandsWithoutDate', { given_name: users[currentSow.arbitrator].given_name, family_name: users[currentSow.arbitrator].family_name })}
                            </CardText>
                          }
                          {currentSow.status == SowStatus.PAYMENT_SENT &&
                            <CardText className="text-muted text-center">
                              {"Awaiting payment to complete by 7 days starting from the acceptance date by the buyer."}
                            </CardText>
                          }
                          {currentSow.seller == user.username &&
                            <>
                              {currentSow.status == SowStatus.SUBMITTED &&
                                <CardText className="text-muted text-center">
                                  {t('chat.emptyComandsWithDate', { given_name: users[currentSow.buyer].given_name, family_name: users[currentSow.buyer].family_name, date: new Date(currentSow.sowExpiration).toLocaleDateString() })}
                                </CardText>
                              }
                              {(currentSow.status == SowStatus.ACCEPTED_PAID || currentSow.status == SowStatus.REVIEW_REQUIRED) &&
                                <Button data-cy={SowCommands.CLAIM_MILESTONE_MET} block color="primary" name={SowCommands.CLAIM_MILESTONE_MET}
                                  onClick={toggleModalClaimMilestoneMet}
                                >Claim milestone met</Button>
                              }
                              {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                                <CardText className="text-muted text-center">
                                  {/* {t('chat.emptyComandsWithDate', {given_name: users[currentSow.buyer].given_name, family_name: users[currentSow.buyer].family_name, date: new Date(currentSow.).toLocaleDateString()})} */}
                                  {t('chat.emptyComandsWithoutDate', { given_name: users[currentSow.buyer].given_name, family_name: users[currentSow.buyer].family_name })}
                                </CardText>
                              }
                            </>
                          }
                          {currentSow.buyer == user.username &&
                            <>
                              {currentSow.status == SowStatus.SUBMITTED &&
                                <>
                                  <ActivityButton data-cy={SowCommands.ACCEPT_AND_PAY} /* disabled={currentChosenArbitrator == ''} */ block color="primary" name={SowCommands.ACCEPT_AND_PAY}
                                    onClick={
                                      !userAttributes.address ?
                                        () => {
                                          history.push('/profile')
                                          dispatch(NotificationActions.willShowNotification({ message: "Please complete your profile before accept and pay.", type: "info" }));
                                        }
                                        : (currentSow.currency != "ALGO" && !algorandAccount.assets.some((accountAsset: any) => JSON.parse(accountAsset)["asset-id"] == assetsCurrencies.find((asset: any) => asset.assetName === currentSow.currency).assetIndex)) ?
                                          () => {
                                            dispatch(AssetCurrencyActions.willGoToAssetCurrencyPage({ address: userAttributes.public_key, history: history }));
                                            dispatch(AssetCurrencyActions.willSelectAssetCurrency({ asset: assetsCurrencies.find((asset: any) => asset.assetName === currentSow.currency).assetIndex }))
                                          }
                                          : toggleModalAcceptSow
                                    }
                                  >
                                    Accept and pay
                                    {/* <span id={SowCommands.ACCEPT_AND_PAY}>Accept and pay</span>
                                    <Tooltip placement="top" isOpen={tooltipOpenAcceptAndPay} target={SowCommands.ACCEPT_AND_PAY} toggle={currentChosenArbitrator == '' ? toggleAcceptAndPay : () => { }}>
                                      Please choose an arbitrator
                                    </Tooltip> */}
                                  </ActivityButton>
                                </>

                              }
                              {currentSow.status == SowStatus.ACCEPTED_PAID &&
                                <CardText className="text-muted text-center">
                                  {t('chat.emptyComandsWithDate', { given_name: users[currentSow.seller].given_name, family_name: users[currentSow.seller].family_name, date: new Date(currentSow.deadline).toLocaleDateString() })}
                                </CardText>
                              }
                              {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                                <ActivityButton data-cy={SowCommands.REQUEST_REVIEW} block color="primary" name={SowCommands.REQUEST_REVIEW}
                                  disabled={currentSow.numberReviews == 0}
                                  onClick={toggleModalRequestReview}
                                >Request review</ActivityButton>
                              }
                              {(currentSow.status == SowStatus.SUBMITTED || currentSow.status == SowStatus.MILESTONE_CLAIMED) &&
                                <ActivityButton data-cy={SowCommands.REJECT} block color="primary" name={SowCommands.REJECT}
                                  onClick={toggleModalReject}
                                >Reject</ActivityButton>
                              }
                              {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                                <ActivityButton data-cy={SowCommands.ACCEPT_MILESTONE} block color="primary" name={SowCommands.ACCEPT_MILESTONE}
                                  onClick={toggleModalAcceptMilestone}
                                >Accept milestone</ActivityButton>
                              }
                              {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                                <CardText className="text-muted text-center">
                                  {t('chat.buyerMilestoneClaimedInfo')}
                                </CardText>
                              }
                              {currentSow.status == SowStatus.REVIEW_REQUIRED &&
                                <CardText className="text-muted text-center">
                                  {t('chat.emptyComandsWithoutDate', { given_name: users[currentSow.seller].given_name, family_name: users[currentSow.seller].family_name })}
                                </CardText>
                              }
                            </>
                          }
                        </Jumbotron>
                      </Col>
                    </Row>
                  }
                  <Row>
                    <Col className="col-12">
                      <SowAttachments />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {(currentSow.status === SowStatus.SUBMITTED || currentSow.status === SowStatus.ACCEPTED_PAID) &&
            <AcceptAndPay modal={modalOpenAcceptSow} toggle={toggleModalAcceptSow} />
          }
          {(currentSow.status == SowStatus.ACCEPTED_PAID || currentSow.status == SowStatus.REVIEW_REQUIRED || currentSow.status == SowStatus.MILESTONE_CLAIMED) &&
            <ClaimMilestoneMet modal={modalOpenClaimMilestoneMet} toggle={toggleModalClaimMilestoneMet} />
          }
          {(currentSow.status === SowStatus.MILESTONE_CLAIMED || currentSow.status === SowStatus.PAYMENT_SENT) &&
            <AcceptMilestone modal={modalOpenAcceptMilestone} toggle={toggleModalAcceptMilestone} />
          }
          <Reject modal={modalOpenReject} toggle={toggleModalReject} />
          <RequestReview modal={modalOpenRequestReview} toggle={toggleModalRequestReview} />
        </Container>
      }
    </>
  )
}