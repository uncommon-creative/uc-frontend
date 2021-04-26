import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, CardTitle, Badge,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGavel, faInfoCircle, faCalendarDay, faCalendarTimes, faCalendarCheck, faMoneyBillAlt, faCheckDouble, faPeopleArrows, faTags, faBalanceScale } from '@fortawesome/free-solid-svg-icons'

import { actions as SowActions, selectors as SowSelectors, SowCommands, SowStatus } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { SowHtml } from './SowHtml';
import { ActivityButton } from '../common/ActivityButton';
import { SowStatusBadge } from '../../components/common/SowStatusBadge'

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const SowDetails = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const html = useSelector(SowSelectors.getHtml)
  const users = useSelector(ProfileSelectors.getUsers)

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" scrollable={true}>

      <ModalHeader toggle={toggle}>
        <CardTitle className="">{currentSow.title}</CardTitle>
        <CardSubtitle tag="h6" className="text-muted">{currentSow.sow}</CardSubtitle>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col className="col-lg-8 col-12">
            {currentSow.description &&
              <Jumbotron>
                <Row>
                  <Col>
                    <CardText className="my-1" name="description" id="description">
                      <div dangerouslySetInnerHTML={{ __html: currentSow.description }} />
                    </CardText>
                  </Col>
                </Row>
              </Jumbotron>
            }
            {currentSow.licenseTermsNotes &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faBalanceScale} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {currentSow.licenseTermsNotes}
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    License Terms
                  </CardText>
                </Col>
              </Row>
            }
          </Col>
          <Col className="col-lg-4 col-12">
            {currentSow.seller &&
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
            {currentSow.buyer && currentSow.buyer != "not_set" &&
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
            {currentSow.arbitrator && currentSow.arbitrator != 'not_set' &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faGavel} size='1x' className="text-primary" />
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
            }
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  <SowStatusBadge status={currentSow.status} />
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Status
                  </CardText>
              </Col>
            </Row>
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faCalendarDay} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  {new Date(currentSow.createdAt).toLocaleDateString()}
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Created at
                </CardText>
              </Col>
            </Row>
            {currentSow.deadline &&
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
            }
            {currentSow.sowExpiration &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faCalendarCheck} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {new Date(currentSow.sowExpiration).toLocaleDateString()}
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Order must be confirmed by
                </CardText>
                </Col>
              </Row>
            }
            {typeof currentSow.price === "number" &&
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
            }
            {currentSow.quantity &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faCheckDouble} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {currentSow.quantity}
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Quantity
                </CardText>
                </Col>
              </Row>
            }
            <Row>
              <Col className="col-1 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faPeopleArrows} size='1x' className="text-primary" />
              </Col>
              <Col>
                <CardText className="m-0">
                  {currentSow.numberReviews}
                </CardText>
                <CardText className="text-primary" style={{ fontSize: 12 }}>
                  Number of reviews
                </CardText>
              </Col>
            </Row>
            {currentSow.tags.length > 0 &&
              <Row>
                <Col className="col-1 d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faTags} size='1x' className="text-primary" />
                </Col>
                <Col>
                  <CardText className="m-0">
                    {currentSow.tags && currentSow.tags.map((tag: any, index: any) => {
                      return (
                        <Badge className="mr-2" color="primary">{JSON.parse(tag).label}</Badge>
                      )
                    })}
                  </CardText>
                  <CardText className="text-primary" style={{ fontSize: 12 }}>
                    Tags
                </CardText>
                </Col>
              </Row>
            }
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        {currentSow.status != SowStatus.DRAFT &&
          <ActivityButton data-cy='willBuildHtml' name="willBuildHtml" color="primary" onClick={() => {
            dispatch(SowActions.willBuildHtml({ currentSow: currentSow }))
          }}>Show legal agreement</ActivityButton>
        }
        <ActivityButton data-cy='closeSowExtended' name="closeSowExtended" outline color="primary" onClick={() => {
          toggle()
        }}>Close</ActivityButton>
      </ModalFooter>

      <SowHtml modal={html != ''} toggle={() => dispatch(SowActions.didBuildHtml(''))} />
    </Modal >
  )
}