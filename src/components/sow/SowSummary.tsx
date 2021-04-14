import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg,
  Button, Container, Col, Row, Tooltip, ListGroupItem, Jumbotron,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faArrowAltCircleRight, faArrowAltCircleLeft, faTimesCircle, faInfoCircle, faCalendarTimes, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { actions as NotificationActions } from '../../store/slices/notification'
import { actions as SowActions, selectors as SowSelectors, SowStatus, SowCommands } from '../../store/slices/sow'
import { selectors as AuthSelectors } from '../../store/slices/auth'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { ChatSow } from '../../components/ChatSow'
import { ArbitratorDetailXS } from '../../components/arbitrator/ArbitratorDetailXS'
import { ActivityButton } from '../../components/common/ActivityButton'
import { RefreshButton } from '../../components/common/RefreshButton'
import { FileButton } from '../../components/common/FileButton'
import { SowDetails } from '../../components/sow/SowDetails'
import UCLogo from '../../images/UC.webp'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const SowSummary = () => {

  let { code }: any = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const currentArbitrators = useSelector(SowSelectors.getCurrentArbitrators);
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const newAttachments = useSelector(SowSelectors.getNewAttachments)
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)

  const [modalOpenSowDetails, setModalOpenSowDetails] = React.useState(false);
  const toggleModalSowDetails = () => setModalOpenSowDetails(!modalOpenSowDetails);

  return (
    <>
      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Summary</CardSubtitle>
      <Jumbotron>
        <Card>
          <CardBody>
            {currentSow.seller != user.username &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faUser} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {validateEmail(currentSow.seller) ?
                      currentSow.seller
                      :
                      users[currentSow.seller].given_name + ' ' + users[currentSow.seller].family_name
                    }
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Seller
                  </CardText>
                </Col>
              </Row>
            }
            {currentSow.buyer != user.username &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faUser} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {validateEmail(currentSow.buyer) ?
                      currentSow.buyer
                      :
                      users[currentSow.buyer].given_name + ' ' + users[currentSow.buyer].family_name
                    }
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Buyer
                  </CardText>
                </Col>
              </Row>
            }
            {/* {currentSow.arbitrator &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faTimesCircle} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {validateEmail(currentSow.arbitrator) ?
                      currentSow.arbitrator
                      :
                      users[currentSow.arbitrator].given_name + ' ' + users[currentSow.arbitrator].family_name
                    }
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Arbitrator
                  </CardText>
                </Col>
              </Row>
            } */}
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  {currentSow.status}
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Status
                  </CardText>
              </Col>
            </Row>
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faCalendarTimes} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  {new Date(currentSow.deadline).toLocaleDateString()}
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Deadline
                  </CardText>
              </Col>
            </Row>
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faMoneyBillAlt} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  {currentSow.price} {currentSow.currency}
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Price
                  </CardText>
              </Col>
            </Row>

            <Row className="mt-3">
              {currentSow.seller == user.username && currentSow.status == SowStatus.SUBMITTED &&
                <Col className="col-md-6 col-12 p-1">
                  <Button color="primary" block to="/create-statement-of-work" outline tag={Link}>Edit</Button>
                </Col>
              }
              <Col className={currentSow.seller == user.username && currentSow.status == SowStatus.SUBMITTED ? "col-md-6 col-12 p-1" : "col-12 p-1"}>
                <Button color="primary" block onClick={toggleModalSowDetails}>Details</Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Jumbotron>

      <SowDetails modal={modalOpenSowDetails} toggle={toggleModalSowDetails} />
    </>
  )
}