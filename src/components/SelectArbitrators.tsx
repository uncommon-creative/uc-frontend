import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import { useFormikContext } from 'formik';

import { ActivityButton } from '../components/ActivityButton'
import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { actions as SOWActions } from '../store/slices/sow'

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

  const { values, setFieldValue } = useFormikContext();
  React.useEffect(() => {
    setFieldValue('arbitrators', selectedArbitrators)
  }, [selectedArbitrators]);

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
                        selectedArbitrators.push(currentArbitrator)
                        setSelectedArbitrators(selectedArbitrators)
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
                          selectedArbitrators.splice(index, 1)
                          setSelectedArbitrators(selectedArbitrators)
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
        <Button disabled={selectedArbitrators.length == 3 ? false : true} name="confirmArbitrators" color="primary" onClick={() => {
          dispatch(SOWActions.willConfirmArbitrators({ arbitrators: selectedArbitrators, toggle: toggle }))
        }}>Confirm arbitrators</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}