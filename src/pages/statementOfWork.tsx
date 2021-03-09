import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItemHeading, ListGroupItem, Jumbotron,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { actions as NotificationActions } from '../store/slices/notification'
import { actions as SowActions, selectors as SowSelectors, SowStatus, SowCommands } from '../store/slices/sow'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ChatSow } from '../components/ChatSow'
import { ArbitratorDetailXS } from '../components/arbitrator/ArbitratorDetailXS'
import { ActivityButton } from '../components/common/ActivityButton'
import { RefreshButton } from '../components/common/RefreshButton'
import { FileButton } from '../components/common/FileButton';
import { selectors as UISelectors } from '../store/slices/ui'
import { SowDetails } from '../components/sow/SowDetails'
import { AcceptSow } from '../components/transaction/AcceptSow'
import { ClaimMilestoneMet } from '../components/transaction/ClaimMilestoneMet'
import { AcceptMilestone } from '../components/transaction/AcceptMilestone'
import { Reject } from '../components/transaction/Reject'
import { RequestReview } from '../components/transaction/RequestReview'

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
  const currentArbitrators = useSelector(SowSelectors.getCurrentArbitrators);
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)
  const [modalOpenSowDetails, setModalOpenSowDetails] = React.useState(false);
  const [modalOpenAcceptSow, setModalOpenAcceptSow] = React.useState(false);
  const [modalOpenClaimMilestoneMet, setModalOpenClaimMilestoneMet] = React.useState(false);
  const [modalOpenAcceptMilestone, setModalOpenAcceptMilestone] = React.useState(false);
  const [modalOpenReject, setModalOpenReject] = React.useState(false);
  const [modalOpenRequestReview, setModalOpenRequestReview] = React.useState(false);

  const toggleModalSowDetails = () => setModalOpenSowDetails(!modalOpenSowDetails);
  const toggleModalAcceptSow = () => setModalOpenAcceptSow(!modalOpenAcceptSow);
  const toggleModalClaimMilestoneMet = () => setModalOpenClaimMilestoneMet(!modalOpenClaimMilestoneMet);
  const toggleModalAcceptMilestone = () => setModalOpenAcceptMilestone(!modalOpenAcceptMilestone);
  const toggleModalReject = () => setModalOpenReject(!modalOpenReject);
  const toggleModalRequestReview = () => setModalOpenRequestReview(!modalOpenRequestReview);

  React.useEffect(() => {
    console.log("in statementOfWorkPage currentSow: ", currentSow)
    dispatch(SowActions.willGetSow({ sow: code }))
  }, [])

  React.useEffect(() => {
    currentSow.status == SowStatus.SUBMITTED && dispatch(ArbitratorActions.selectingOneArbitrator())
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
                <Col className="col-md-8 col-12">
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Chat</CardSubtitle>
                  <Jumbotron>
                    <ChatSow currentSow={currentSow} />
                  </Jumbotron>
                </Col>
                <Col className="col-md-4 col-12">
                  <Row>
                    <Col className="col-12">
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Summary</CardSubtitle>

                      <Jumbotron>
                        {currentSow.seller == user.username && currentSow.status == SowStatus.SUBMITTED &&
                          <Button color="primary" block to="/create-statement-of-work" outline tag={Link}>Edit</Button>
                        }
                        {/* <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{currentSow.title}</CardSubtitle> */}
                        {currentSow.seller == user.username ?
                          <Row className="d-flex justify-content-between">
                            <Col className="col-12 col-lg-auto">
                              <CardText>Buyer:</CardText>
                            </Col>
                            <Col className="col-12 col-lg-auto text-lg-right">
                              <CardText color="primary">
                                {validateEmail(currentSow.buyer) ?
                                  currentSow.buyer
                                  :
                                  users[currentSow.buyer].given_name + ' ' + users[currentSow.buyer].family_name
                                }
                              </CardText>
                            </Col>
                          </Row>
                          :
                          <Row className="d-flex justify-content-between">
                            <Col className="col-12 col-lg-auto">
                              <CardText>Seller:</CardText>
                            </Col>
                            <Col className="col-12 col-lg-auto text-lg-right">
                              <CardText color="primary">
                                {validateEmail(currentSow.seller) ?
                                  currentSow.seller
                                  :
                                  users[currentSow.seller].given_name + ' ' + users[currentSow.seller].family_name
                                }
                              </CardText>
                            </Col>
                          </Row>
                        }
                        {currentSow.arbitrator &&
                          <Row className="d-flex justify-content-between">
                            <Col className="col-12 col-lg-auto">
                              <CardText>Arbitrator:</CardText>
                            </Col>
                            <Col className="col-12 col-lg-auto text-lg-right">
                              <CardText color="primary">
                                {users[currentSow.arbitrator].given_name + ' ' + users[currentSow.arbitrator].family_name}
                              </CardText>
                            </Col>
                          </Row>
                        }
                        <Row className="d-flex justify-content-between">
                          <Col className="col-12 col-lg-auto">
                            <CardText>Deadline:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-auto text-lg-right">
                            <CardText color="primary">{new Date(currentSow.deadline).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row className="d-flex justify-content-between">
                          <Col className="col-12 col-lg-auto">
                            <CardText>Price:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-auto text-lg-right">
                            <CardText color="primary">{currentSow.price} {currentSow.currency}</CardText>
                          </Col>
                        </Row>
                        <Row className="d-flex justify-content-between">
                          <Col className="col-12 col-lg-auto">
                            <CardText>Created:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-auto text-lg-right">
                            <CardText color="primary">{new Date(currentSow.createdAt).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row className="d-flex justify-content-between">
                          <Col className="col-12 col-lg-auto">
                            <CardText>Expiration:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-auto text-lg-right">
                            <CardText color="primary">{new Date(currentSow.sowExpiration).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row className="d-flex justify-content-between">
                          <Col className="col-12 col-lg-auto">
                            <CardText>Status:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-auto text-lg-right">
                            <CardText color="primary">{currentSow.status}</CardText>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col className="text-lg-right">
                            <Button color="link" onClick={toggleModalSowDetails}>view details</Button>
                          </Col>
                        </Row>

                      </Jumbotron>
                    </Col>
                  </Row>
                  {currentSow.status == SowStatus.SUBMITTED && currentSow.buyer == user.username &&
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
                  }
                  {(currentSow.status != SowStatus.REJECTED && currentSow.status != SowStatus.EXPIRED && currentSow.status != SowStatus.MILESTONE_ACCEPTED) &&
                    <Row>
                      <Col className="col-12">
                        <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Special commands</CardSubtitle>
                        <Jumbotron>
                          {currentSow.arbitrator && currentSow.status == SowStatus.DISPUTED &&
                            <CardText className="text-muted text-center">
                              {t('chat.emptyComandsWithoutDate', { given_name: users[currentSow.arbitrator].given_name, family_name: users[currentSow.arbitrator].family_name })}
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
                                <ActivityButton data-cy={SowCommands.ACCEPT_AND_PAY} disabled={currentChosenArbitrator == ''} block color="primary" name={SowCommands.ACCEPT_AND_PAY}
                                  onClick={
                                    userAttributes.address ? toggleModalAcceptSow
                                      : () => {
                                        history.push('/profile')
                                        dispatch(NotificationActions.willShowNotification({ message: "Please complete your profile before accept and pay.", type: "info" }));
                                      }
                                  }
                                >{currentChosenArbitrator == '' ? "Select an arbitrator" : "Accept and pay"}</ActivityButton>
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
                              {currentSow.status == SowStatus.REVIEW_REQUIRED &&
                                <CardText className="text-muted text-center">
                                  {t('chat.emptyComandsWithoutDate', { given_name: users[currentSow.seller].given_name, family_name: users[currentSow.seller].family_name })}
                                </CardText>
                              }
                            </>
                          }
                        </Jumbotron>
                      </Col>
                    </Row>}
                  <Row>
                    <Col className="col-12">
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Attachments</CardSubtitle>
                      <Jumbotron>
                        {newAttachments.map((attachment: any, index: any) => {
                          return (
                            attachment.owner === currentSow.sow &&
                            <ListGroupItem data-cy="attachmentsSow" key={index}>
                              <FileButton file={attachment} />
                            </ListGroupItem>
                          )
                        })}

                        <CardText>Seller's:</CardText>
                        {newAttachments.map((attachment: any, index: any) => {
                          return (attachment.owner === currentSow.seller &&
                            <>
                              <ListGroupItem data-cy="attachmentsSeller" key={index} >
                                <FileButton file={attachment} />
                              </ListGroupItem>
                            </>
                          )
                        })}

                        <CardText>Buyer's:</CardText>
                        {newAttachments.map((attachment: any, index: any) => {
                          return (attachment.owner === currentSow.buyer &&
                            <>
                              <ListGroupItem data-cy="attachmentsBuyer" key={index}>
                                <FileButton file={attachment} />
                              </ListGroupItem>
                            </>
                          )
                        })}
                      </Jumbotron>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <SowDetails modal={modalOpenSowDetails} toggle={toggleModalSowDetails} />
          <AcceptSow modal={modalOpenAcceptSow} toggle={toggleModalAcceptSow} />
          <ClaimMilestoneMet modal={modalOpenClaimMilestoneMet} toggle={toggleModalClaimMilestoneMet} />
          <AcceptMilestone modal={modalOpenAcceptMilestone} toggle={toggleModalAcceptMilestone} />
          <Reject modal={modalOpenReject} toggle={toggleModalReject} />
          <RequestReview modal={modalOpenRequestReview} toggle={toggleModalRequestReview} />
        </Container>
      }
    </>
  )
}