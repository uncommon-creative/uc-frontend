import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle, CardGroup,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
  FormGroup, Label, Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { ArbitratorDetail } from '../../components/ArbitratorDetail'
import { ArbitratorSummary } from '../../components/ArbitratorSummary'

import { ArbitratorDetailMD } from './ArbitratorDetailMD'

export const ArbitratorsList = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)

  return (
    <CardGroup>
      {arbitratorsList.map((element: any, index: any) => {
        return (
          <Col className="col-md-3 col-12 d-flex">
            <ArbitratorDetailMD arbitrator={element} />
          </Col>
        )
      })}
    </CardGroup>
  )
}