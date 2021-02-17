import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg, CardImgOverlay,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
  FormGroup, Label, Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'

export const ArbitratorDetailXS = ({ arbitrator, index }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  console.log("in ArbitratorDetailXS", arbitrator)

  return (
    <Row className="d-flex flex-nowrap">
      {/* <Col className="col-1">
        <Button close onClick={() => {
          dispatch(ArbitratorActions.willDeselectArbitrator(index))
        }} />
      </Col> */}
      <Col className="col-3 p-0 border">
        <CardImg width="100%" src="//placehold.it/150" alt={'Arbitrator ' + arbitrator.given_name + ' ' + arbitrator.family_name} />
        <CardImgOverlay className="p-0">
          <Button close className="position-absolute top-0 start-0 translate-middle" onClick={() => {
            dispatch(ArbitratorActions.willDeselectArbitrator(index))
          }} />
        </CardImgOverlay>
      </Col>
      <Col className="col-9 flex-fill">
        <Row>
          <CardText>{arbitrator.given_name}</CardText>
        </Row>
        <Row>
          <CardText>{arbitrator.family_name}</CardText>
        </Row>
      </Col>
    </Row>
  )
}