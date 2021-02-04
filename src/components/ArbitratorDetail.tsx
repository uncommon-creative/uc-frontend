import * as React from 'react';
import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText,
  Badge, Row, Col, CardText
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'

export const ArbitratorDetail = ({ arbitrator, size }: any) => {

  console.log("in ArbitratorDetail with: ", arbitrator)


  return (
    <>
      <ListGroupItemHeading>
        <Row>
          <Col className="col-md-9 col-12">
            <CardText className={size}>
              {arbitrator.given_name} {arbitrator.family_name}
            </CardText>
          </Col>
          <Col className="col-md-3 col-12">
            <Badge pill color="primary">{arbitrator.reputation}</Badge>
          </Col>
        </Row>
      </ListGroupItemHeading>
      <ListGroupItemText>{arbitrator.fee.flat + ' ' + arbitrator.currency + ' + ' + arbitrator.fee.perc + '%'}</ListGroupItemText>
      <Row>
        {arbitrator.tags.map((tag: any, index: any) => {
          return (
            <Col>
              <Badge color="primary">{JSON.parse(tag).label}</Badge>
            </Col>
          )
        })}
      </Row>
    </>
  )
}