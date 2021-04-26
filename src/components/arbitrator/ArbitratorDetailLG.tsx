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

import { configuration } from '../../config'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { selectors as AuthSelectors } from '../../store/slices/auth'
import { actions as SowActions } from '../../store/slices/sow'
import { ActivityButton } from '../common/ActivityButton';
import Portrait from '../../images/Portrait.png'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const ArbitratorDetailLG = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const selectingThreeArbitrators = useSelector(ArbitratorSelectors.isSelectingThreeArbitrators)
  const selectingOneArbitrator = useSelector(ArbitratorSelectors.isSelectingOneArbitrator)
  const selectingArbitratorSow = useSelector(ArbitratorSelectors.isSelectingArbitratorSow)
  const currentArbitrator = useSelector(ArbitratorSelectors.getCurrentArbitrator)
  const currentSelectedArbitrators = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrators)
  const currentSelectedArbitrator = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrator)
  const users = useSelector(ProfileSelectors.getUsers)

  const addDefaultSrc = (ev: any) => { ev.target.src = Portrait }

  return (
    <>
      {users[currentArbitrator.user] &&
        <Modal isOpen={modal} toggle={toggle} size="xl" scrollable={true}>
          {/* <ModalHeader>{currentArbitrator.given_name}</ModalHeader> */}
          <ModalBody>
            <Row className='d-flex flex-wrap'>
              <Col className="col-md-3 col-12 text-center">
                <img height="150" alt="Portrait" onError={addDefaultSrc}
                  src={`${configuration[stage].host}/resources/${currentArbitrator.user}/portrait?${Date.now()}`}
                />
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
                  {users[currentArbitrator.user].bio ?
                    users[currentArbitrator.user].bio
                    : t('arbitrator.bio')}
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
          </ModalBody>
          {selectingThreeArbitrators &&
            <ModalFooter>
              {currentSelectedArbitrators.some((arb: any) => arb.user === currentArbitrator.user) ?
                <Button disabled color="primary">Arbitrator added</Button>
                : currentSelectedArbitrators.length < 3 ?
                  <ActivityButton data-cy='inputSowArbitratorsAdd' name="ArbitratorDetailLG" color="primary" onClick={() => {
                    dispatch(ArbitratorActions.willAddArbitrator(currentArbitrator))
                    toggle()
                  }}>Add to arbitrators</ActivityButton>
                  : <Button disabled color="primary">Max number of arbitrators added</Button>
              }
            </ModalFooter>
          }
          {selectingOneArbitrator &&
            <ModalFooter>
              <ActivityButton data-cy='willChooseArbitrator' name="ArbitratorDetailLG" color="primary" onClick={() => {
                dispatch(ArbitratorActions.willChooseArbitrator(currentArbitrator.user))
                toggle()
              }}>Select the arbitrator</ActivityButton>
            </ModalFooter>
          }

          {selectingArbitratorSow &&
            <ModalFooter>
              {currentArbitrator.user != currentSelectedArbitrator.user ?
                <ActivityButton data-cy='willSelectArbitrator' name="ArbitratorDetailLG" color="primary" onClick={() => {
                  dispatch(ArbitratorActions.willSelectArbitrator({ arbitrator: currentArbitrator }))
                  toggle()
                }}>Select the arbitrator</ActivityButton>
                : <Button disabled color="primary">Arbitrator selected</Button>
              }
            </ModalFooter>
          }
        </Modal>
      }
    </>
  )
}