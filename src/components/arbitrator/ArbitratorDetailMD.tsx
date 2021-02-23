import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
  FormGroup, Label, Input, Badge
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { ArbitratorDetailLG } from './ArbitratorDetailLG'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import Avatar from '../../images/Avatar.png'

export const ArbitratorDetailMD = ({ arbitrator }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = React.useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <>
      <Card tag="button" color="primary" className="flex-fill mx-auto" outline onClick={() => {
        dispatch(ArbitratorActions.willViewCurrentArbitrator(arbitrator))
        setModalOpen(!modalOpen)
      }}>
        <CardBody className="mx-auto">
          <Row>
            <Col>
              <img src={Avatar} width="100" alt="Avatar" />
            </Col>
          </Row>
          <Row>
            <Col>
              <CardTitle data-cy='inputSowArbitratorsSelect' tag="h6">{arbitrator.given_name} {arbitrator.family_name}</CardTitle>
            </Col>
          </Row>
          {/* <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle> */}
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
          {/* <Row>
            {arbitrator.tags.map((tag: any, index: any) => {
              return (
                <Col>
                  <Badge color="primary">{JSON.parse(tag).label}</Badge>
                </Col>
              )
            })}
          </Row> */}
        </CardBody>
      </Card>
      <ArbitratorDetailLG modal={modalOpen} toggle={toggleModal} />
    </>
  )
}