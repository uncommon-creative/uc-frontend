import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  CardImg, CardImgOverlay,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
  FormGroup, Label, Input, Badge, Jumbotron
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { ActivityButton } from '../common/ActivityButton';

export const ArbitratorDetailLG = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const selectingArbitrators = useSelector(ArbitratorSelectors.isSelectingArbitrators)
  const currentArbitrator = useSelector(ArbitratorSelectors.getCurrentArbitrator)
  const currentSelectedArbitrators = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrators)

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      {/* <ModalHeader>{currentArbitrator.given_name}</ModalHeader> */}
      <ModalHeader>
        <Row className='d-flex flex-wrap'>
          <Col className="col-md-3 col-12">
            <CardImg width='100%' src="//placehold.it/200" alt="Card image cap" />
          </Col>
          <Col className="d-flex justify-content-between flex-column">
            <Row>
              <Col>
                <CardTitle tag="h5">{currentArbitrator.given_name} {currentArbitrator.family_name}</CardTitle>
              </Col>

            </Row>
            <Row>
              <Col>
                {/* <CardTitle tag="h6">{currentArbitrator.reputation}</CardTitle> */}
                <FontAwesomeIcon icon={faStar} size="1x" />
                <FontAwesomeIcon icon={faStar} size="1x" />
                <FontAwesomeIcon icon={faStar} size="1x" />
                <FontAwesomeIcon icon={farStar} size="1x" />
                <FontAwesomeIcon icon={farStar} size="1x" />
              </Col>
            </Row>
            <Row>
              <Col>
                {currentArbitrator.tags && currentArbitrator.tags.map((tag: any, index: any) => {
                  return (
                    <Badge className="mr-2" color="primary">{JSON.parse(tag).label}</Badge>
                  )
                })}
              </Col>
            </Row>
            <Row>
              <Col>
                {currentArbitrator.fee &&
                  <CardSubtitle>
                    {currentArbitrator.fee.flat + ' ' + currentArbitrator.currency + ' + ' + currentArbitrator.fee.perc + '%'}
                  </CardSubtitle>
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Jumbotron>
              {t('arbitrator.description')}
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardText>
              <small className="text-muted">Last updated 3 mins ago</small>
            </CardText>
          </Col>
        </Row>
      </ModalHeader>
      {selectingArbitrators &&
        <ModalFooter>
          {currentSelectedArbitrators.some((arb: any) => arb.user === currentArbitrator.user) ?
            <Button disabled color="primary">Arbitrator added</Button>
            : currentSelectedArbitrators.length < 3 ?
              <ActivityButton data-cy='inputSowArbitratorsAdd' name="ArbitratorDetailLG" color="primary" onClick={() => {
                dispatch(ArbitratorActions.willSelectArbitrator(currentArbitrator))
                toggle()
              }}>Add to arbitrators</ActivityButton>
              : <Button disabled color="primary">Max number of arbitrators added</Button>
          }
        </ModalFooter>
      }
    </Modal>
  )
}