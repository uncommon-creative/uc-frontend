import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';

import { ActivityButton } from '../components/ActivityButton'
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

const ArbitratorSummary = ({ arbitrator }: any) => {
  return (
    <>
      <ListGroupItemHeading>{arbitrator.name}</ListGroupItemHeading>
    </>
  )
}

const ArbitratorDetail = ({ arbitrator }: any) => {
  return (
    <>
      <ListGroupItemHeading>{arbitrator.name}</ListGroupItemHeading>
      <ListGroupItemText>{arbitrator.tags}</ListGroupItemText>
      <ListGroupItemText>{arbitrator.reputation}</ListGroupItemText>
      <ListGroupItemText>{arbitrator.linkedin}</ListGroupItemText>
    </>
  )
}

export const SelectArbitrators = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  const [selectedArbitrators, setSelectedArbitrators] = React.useState([] as any);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg">
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
          <ActivityButton name="selectArbitrators" color="primary" onClick={() => dispatch(SOWActions.willSelectArbitrators())}>Confirm arbitrators</ActivityButton>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}