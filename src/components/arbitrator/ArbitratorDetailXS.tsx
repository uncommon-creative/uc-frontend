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

import { configuration } from '../../config'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { ArbitratorDetailLG } from './ArbitratorDetailLG'
import Portrait from '../../images/Portrait.png'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const ArbitratorDetailXS = ({ arbitrator, index }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = React.useState(false);
  const selectingOneArbitrator = useSelector(ArbitratorSelectors.isSelectingOneArbitrator)
  // console.log("in ArbitratorDetailXS", arbitrator)

  const toggleModal = () => setModalOpen(!modalOpen);
  const addDefaultSrc = (ev: any) => { ev.target.src = Portrait }

  return (
    <>
      <Row className="d-flex flex-nowrap" onClick={() => {
        dispatch(ArbitratorActions.willViewCurrentArbitrator(arbitrator))
        setModalOpen(!modalOpen)
      }}>
        {/* <Col className="col-1">
        <Button close onClick={() => {
          dispatch(ArbitratorActions.willDeselectArbitrator(index))
        }} />
      </Col> */}
        <Col className="col-3 p-0 text-center">
          <img height="45" alt="Portrait" onError={addDefaultSrc}
            src={`${configuration[stage].host}/resources/${arbitrator.user}/portrait?${Date.now()}`}
          />
          {/* {!selectingOneArbitrator &&
            <CardImgOverlay className="p-0">
              <Button close className="position-absolute top-0 start-0 translate-middle" onClick={() => {
                dispatch(ArbitratorActions.willDeselectArbitrator(index))
              }} />
            </CardImgOverlay>
          } */}
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
      <ArbitratorDetailLG modal={modalOpen} toggle={toggleModal} />
    </>
  )
}