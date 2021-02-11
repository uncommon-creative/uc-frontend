import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItemHeading, ListGroupItem, Jumbotron,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from "react-router-dom";

import { actions as SowActions, selectors as SowSelectors, SowStatus, SowCommands } from '../store/slices/sow'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { ChatSow } from '../components/ChatSow'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { ArbitratorDetail } from '../components/ArbitratorDetail';
import { ActivityButton } from '../components/ActivityButton'
import { RefreshButton } from '../components/RefreshButton'
import { FileButton } from '../components/FileButton';
import { selectors as UISelectors } from '../store/slices/ui'
import { AcceptSow } from '../components/AcceptSow'

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const StatementOfWorkPage = () => {

  let { code }: any = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector(UISelectors.isLoading)
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  console.log("in statementOfWorkPage currentSow: ", currentSow)
  const currentArbitrators = useSelector(SowSelectors.getCurrentArbitrators);
  const attachments = useSelector(SowSelectors.getAttachments);
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)
  const [selectedArbitrator, setSelectedArbitrator] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  React.useEffect(() => {
    console.log("in statementOfWorkPage")
    // console.log("in statementOfWorkPage isLoading: ", isLoading)
    console.log("in statementOfWorkPage currentSow: ", currentSow)
    dispatch(SowActions.willGetSow({ sow: code }))
  }, [])

  return (
    <>
      {/* {!isLoading && */}
      {Object.keys(currentSow).length &&
        <Container>
          <Card>
            <CardBody>
              <Row>
                <Col className="col-11">
                  <CardTitle tag="h5" className="text-center">Statement of Work</CardTitle>
                  <CardSubtitle tag="h5" className="mb-2 text-muted text-center">{currentSow.title}</CardSubtitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{currentSow.sow}</CardSubtitle>
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
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Details</CardSubtitle>
                      <Jumbotron>
                        {currentSow.seller == user.username && currentSow.status == SowStatus.SUBMITTED &&
                          <Button color="primary" block to="/create-statement-of-work" outline tag={Link}>Edit</Button>
                        }
                        {/* <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{currentSow.title}</CardSubtitle> */}
                        {currentSow.seller == user.username ?
                          <Row>
                            <Col className="col-12 col-lg-4">
                              <CardText>Buyer:</CardText>
                            </Col>
                            <Col className="col-12 col-lg-8 text-lg-right">
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
                          <Row>
                            <Col className="col-12 col-lg-4">
                              <CardText>Seller:</CardText>
                            </Col>
                            <Col className="col-12 col-lg-8 text-lg-right">
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
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Deadline:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{new Date(currentSow.deadline).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Price:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{currentSow.price} {currentSow.currency}</CardText>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Created:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{new Date(currentSow.createdAt).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Updated:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{new Date(currentSow.updatedAt).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Expiration:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{new Date(currentSow.sowExpiration).toLocaleDateString()}</CardText>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12 col-lg-4">
                            <CardText>Status:</CardText>
                          </Col>
                          <Col className="col-12 col-lg-8 text-lg-right">
                            <CardText color="primary">{currentSow.status}</CardText>
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
                              <ListGroupItem data-cy={`selectArbitrator${element.given_name}`} className={currentSow.arbitrator == element.user ? 'border border-primary' : 'border'} /* active={currentSow.arbitrator == element.user} */ key={index}
                                onClick={() => {
                                  console.log("selecting arbitrator: ", element)
                                  dispatch(SowActions.willSelectArbitrator(element.user))
                                  // setSelectedArbitrator(element.user)
                                }}>
                                <ArbitratorSummary arbitrator={element} size='h6' />
                              </ListGroupItem>
                            )
                          })}
                        </Jumbotron>
                      </Col>
                    </Row>}
                  <Row>
                    <Col className="col-12">
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Special commands</CardSubtitle>
                      <Jumbotron>
                        {currentSow.seller == user.username &&
                          <>
                            {(currentSow.status == SowStatus.ACCEPTED_PAID || currentSow.status == SowStatus.REVIEW_REQUIRED) &&
                              <Button data-cy={SowCommands.CLAIM_MILESTONE_MET} block color="primary" name={SowCommands.CLAIM_MILESTONE_MET} onClick={() => {
                                console.log("Claim milestone met")
                                dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.CLAIM_MILESTONE_MET }, sow: currentSow }));
                              }}>Claim milestone met</Button>
                            }
                          </>
                        }
                        {currentSow.buyer == user.username &&
                          <>
                            {currentSow.status == SowStatus.SUBMITTED &&
                              <ActivityButton data-cy={SowCommands.ACCEPT_AND_PAY} disabled={currentSow.arbitrator == null} block color="primary" name={SowCommands.ACCEPT_AND_PAY}
                                onClick={toggleModal}
                              >{currentSow.arbitrator == null ? "Select an arbitrator" : "Accept and pay"}</ActivityButton>
                            }
                            {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                              <ActivityButton data-cy={SowCommands.REQUEST_REVIEW} block color="primary" name={SowCommands.REQUEST_REVIEW} onClick={() => {
                                console.log("Request review")
                                dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.REQUEST_REVIEW }, sow: currentSow }));
                              }}>Request review</ActivityButton>
                            }
                            {(currentSow.status == SowStatus.SUBMITTED || currentSow.status == SowStatus.MILESTONE_CLAIMED) &&
                              <ActivityButton data-cy={SowCommands.REJECT} block color="primary" name={SowCommands.REJECT} onClick={() => {
                                console.log("Reject")
                                dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.REJECT }, sow: currentSow }));
                              }}>Reject</ActivityButton>
                            }
                            {currentSow.status == SowStatus.MILESTONE_CLAIMED &&
                              <ActivityButton data-cy={SowCommands.ACCEPT_MILESTONE} block color="primary" name={SowCommands.ACCEPT_MILESTONE} onClick={() => {
                                console.log("Accept milestone")
                                dispatch(ChatActions.willSendCommandChat({ values: { command: SowCommands.ACCEPT_MILESTONE }, sow: currentSow }));
                              }}>Accept milestone</ActivityButton>
                            }
                          </>
                        }
                      </Jumbotron>
                    </Col>
                  </Row>
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

          <AcceptSow modal={modalOpen} toggle={toggleModal} />
        </Container>
      }
    </>
  )
}