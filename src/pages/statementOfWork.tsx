import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItemHeading, ListGroupItem, Jumbotron,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ChatSow } from '../components/ChatSow'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { UploadFileButton } from '../components/UploadFileButton';

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const StatementOfWorkPage = () => {

  const dispatch = useDispatch();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const confirmedArbitrators = useSelector(SowSelectors.getConfirmedArbitrators);
  const attachments = useSelector(SowSelectors.getAttachments);
  const user = useSelector(AuthSelectors.getUser)

  React.useEffect(() => {

  }, []);

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="text-center">Statement of Work</CardTitle>
          <CardSubtitle tag="h5" className="mb-2 text-muted text-center">{currentSow.title}</CardSubtitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{currentSow.sow}</CardSubtitle>

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
                              currentSow.buyer.substring(0, 5).toUpperCase()}
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
                              currentSow.seller.substring(0, 5).toUpperCase()}
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
                        <CardText>Status:</CardText>
                      </Col>
                      <Col className="col-12 col-lg-8 text-lg-right">
                        <CardText color="primary">{currentSow.status}</CardText>
                      </Col>
                    </Row>

                  </Jumbotron>
                </Col>
              </Row>
              <Row>
                <Col className="col-12">
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Special commands</CardSubtitle>
                  <Jumbotron>
                    {currentSow.seller == user.username ?
                      <Button block color="primary" name="CLAIM_MILESTONE_MET" onClick={() => {
                        console.log("Claim milestone met")
                        dispatch(ChatActions.willSendCommandChat({ values: { command: "CLAIM_MILESTONE_MET" }, sow: currentSow.sow }));
                      }}>Claim milestone met</Button>
                      :
                      <>
                        <Button block color="primary" name="REQUIRE_REVIEW" onClick={() => {
                          console.log("Require review")
                          dispatch(ChatActions.willSendCommandChat({ values: { command: "REQUIRE_REVIEW" }, sow: currentSow.sow }));
                        }}>Require review</Button>
                        <Button block color="primary" name="REJECT" onClick={() => {
                          console.log("Reject")
                          dispatch(ChatActions.willSendCommandChat({ values: { command: "REJECT" }, sow: currentSow.sow }));
                        }}>Reject</Button>
                        <Button block color="primary" name="ACCEPT_MILESTONE" onClick={() => {
                          console.log("Accept milestone")
                          dispatch(ChatActions.willSendCommandChat({ values: { command: "ACCEPT_MILESTONE" }, sow: currentSow.sow }));
                        }}>Accept milestone</Button>
                      </>
                    }
                  </Jumbotron>
                </Col>
              </Row>
              <Row>
                <Col className="col-12">
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Attachments</CardSubtitle>
                  <Jumbotron>
                    {attachments.map((attachment: any, index: any) => {
                      return (
                        <ListGroupItem key={index}>
                          <ListGroupItemHeading>
                            <UploadFileButton name={attachment[1]} />
                          </ListGroupItemHeading>
                        </ListGroupItem>
                      )
                    })}
                  </Jumbotron>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  )
}