import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import { useFormikContext } from 'formik';
import update from 'immutability-helper';

import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ActivityButton } from './ActivityButton';

const ARBITRATORS = [
  {
    id: 1,
    name: "John C.",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
  {
    id: 2,
    name: "Charles",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
  {
    id: 3,
    name: "Sabrina G.",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
  {
    id: 4,
    name: "Emma P.",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
  {
    id: 5,
    name: "Sandi",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
  {
    id: 6,
    name: "Himanshu",
    tags: "graphic",
    reputation: 5,
    linkedin: "https://it.linkedin.com/"
  },
]

export const SelectArbitrators = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  const [selectedArbitrators, setSelectedArbitrators] = React.useState([] as any);
  const confirmedArbitrators = useSelector(SowSelectors.getArbitrators);
  const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)

  const { values, setFieldValue } = useFormikContext();

  React.useEffect(() => {
    if (modal) {
      setSelectedArbitrators(confirmedArbitrators)
      setCurrentArbitrator({})

      dispatch(ArbitratorActions.willGetArbitratorsList())
    }
  }, [modal]);

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Select three arbitrators</ModalHeader>
      <ModalBody>
        <Row>
          <Col className="col-md-6 col-12">
            <ListGroup>
              {ARBITRATORS.map((element: any, index: any) => {
                return (
                  <ListGroupItem key={index} action onClick={() => setCurrentArbitrator(element)}>
                    <ArbitratorSummary arbitrator={element} />
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Col>
          <Col className="col-md-6 col-12">
            <Row>
              <Col className="col-12">
                {currentArbitrator.name &&
                  <ListGroupItem>
                    <ArbitratorDetail arbitrator={currentArbitrator} />
                    {selectedArbitrators.length < 3 ?
                      <Button color="primary" onClick={() => {
                        setSelectedArbitrators(update(selectedArbitrators, { $push: [currentArbitrator] }))
                      }}>Add to arbitrators</Button>
                      :
                      <ListGroupItemText>You reached the max number of arbitrators</ListGroupItemText>
                    }
                  </ListGroupItem>}
              </Col>
            </Row>
            <Row>
              {selectedArbitrators.map((element: any, index: any) => {
                return (
                  <Col className="col-sm-4">
                    <ListGroupItem key={index}>
                      <ListGroupItemHeading>
                        <Button close onClick={() => {
                          setSelectedArbitrators(update(selectedArbitrators, { $splice: [[index, 1]] }))
                        }} />
                      </ListGroupItemHeading>
                      <ArbitratorSummary arbitrator={element} />
                    </ListGroupItem>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <ActivityButton disabled={selectedArbitrators.length == 3 ? false : true} name="confirmArbitrators" color="primary" onClick={() => {
          setFieldValue('arbitrators', selectedArbitrators)
          dispatch(SowActions.willConfirmArbitrators({ arbitrators: update(selectedArbitrators, {}), toggle: toggle }))
        }}>Confirm arbitrators</ActivityButton>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}