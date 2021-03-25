import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle, Badge,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { SowHtml } from './SowHtml';
import { ActivityButton } from '../common/ActivityButton';

export const SowDetails = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const html = useSelector(SowSelectors.getHtml)
  const users = useSelector(ProfileSelectors.getUsers)

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">

      <ModalHeader toggle={toggle}>
        <CardTitle className="">{currentSow.title}</CardTitle>
        <CardSubtitle tag="h6" className="text-muted">{currentSow.sow}</CardSubtitle>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <Label for="seller" tag="h6" className="my-1">Seller:</Label>
          </Col>
          <Col>
            <CardText tag="h6" className="my-1" name="seller" id="seller">{users[currentSow.seller].given_name + ' ' + users[currentSow.seller].family_name}</CardText>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label for="buyer" tag="h6" className="my-1">Buyer:</Label>
          </Col>
          <Col>
            <CardText tag="h6" className="my-1" name="buyer" id="buyer">{users[currentSow.buyer].given_name + ' ' + users[currentSow.buyer].family_name}</CardText>
          </Col>
        </Row>
        {currentSow.arbitrator &&
          <Row>
            <Col>
              <Label for="arbitrator" tag="h6" className="my-1">Arbitrator:</Label>
            </Col>
            <Col>
              <CardText tag="h6" className="my-1" name="arbitrator" id="arbitrator">{users[currentSow.arbitrator].given_name + ' ' + users[currentSow.arbitrator].family_name}</CardText>
            </Col>
          </Row>
        }
        <Row>
          <Col>
            <Label for="status" tag="h6" className="my-1">Status:</Label>
          </Col>
          <Col>
            <CardText tag="h6" className="my-1" name="status" id="status">{currentSow.status}</CardText>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col className="col-md-auto col-12">
            <CardText className="my-1" name="createdAt" id="createdAt">
              Created at: {new Date(currentSow.createdAt).toLocaleDateString()}
            </CardText>
          </Col>
          <Col className="col-md-auto col-12">
            <CardText className="my-1" name="deadline" id="deadline">
              Deadline: {new Date(currentSow.deadline).toLocaleDateString()}
            </CardText>
          </Col>
          <Col className="col-md-auto col-12">
            <CardText className="my-1" name="sowExpiration" id="sowExpiration">
              Order must be confirmed by: {new Date(currentSow.sowExpiration).toLocaleDateString()}
            </CardText>
          </Col>
        </Row>
        {currentSow.licenseTermsNotes &&
          <Row>
            <Col>
              <CardText className="my-1" name="licenseTerms" id="licenseTerms">
                License Terms: {currentSow.licenseTermsNotes}
              </CardText>
            </Col>
          </Row>
        }
        <Jumbotron>
          {/* <CardSubtitle className="text-center text-muted">Milestone 1</CardSubtitle> */}
          <Row className="">
            <Col>
              <Label for="description" tag="h6" >Description:</Label>
              <CardText className="my-1" name="description" id="description">
                <div dangerouslySetInnerHTML={{ __html: currentSow.description }} />
              </CardText>
            </Col>
          </Row>
          <Row className="pt-4">
            <Col className="col-md-auto col-12">
              <CardText className="my-1" name="quantity" id="quantity">
                Quantity: {currentSow.quantity}
              </CardText>
            </Col>
            <Col className="col-md-auto col-12">
              <CardText className="my-1" name="price" id="price">
                Price: {currentSow.price + ' ' + currentSow.currency}
              </CardText>
            </Col>
            <Col className="col-md-auto col-12">
              <CardText className="my-1" name="numberReviews" id="numberReviews">
                Number of reviews: {currentSow.numberReviews}
              </CardText>
            </Col>
          </Row>

          <Row className="pt-4">
            <Col className="">
              {/* <Card> */}
              {currentSow.tags && currentSow.tags.map((tag: any, index: any) => {
                return (
                  <Badge className="mr-2" color="primary">{JSON.parse(tag).label}</Badge>
                )
              })}
              {/* </Card> */}
            </Col>
          </Row>
        </Jumbotron>
      </ModalBody>
      <ModalFooter>
        <ActivityButton data-cy='willBuildHtml' name="willBuildHtml" color="primary" onClick={() => {
          dispatch(SowActions.willBuildHtml({ currentSow: currentSow }))
        }}>Show legal agreement</ActivityButton>
        <ActivityButton data-cy='closeSowExtended' name="closeSowExtended" outline color="primary" onClick={() => {
          toggle()
        }}>Close</ActivityButton>
      </ModalFooter>

      <SowHtml modal={html != ''} toggle={() => dispatch(SowActions.didBuildHtml(''))} />
    </Modal>
  )
}