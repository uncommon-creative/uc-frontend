import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'

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

export const ArbitratorsList = () => {

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)

  const toggleModal = () => setModalOpen(!modalOpen);

  React.useEffect(() => {
    dispatch(ArbitratorActions.willGetArbitratorsList())
    console.log("in ArbitratorsList: ", arbitratorsList)
  }, []);

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="text-center">Arbitrators List</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">List of arbitrators</CardSubtitle>

          <Row>
            <Col className="col-12">
              <ListGroup>
                {ARBITRATORS.map((element: any, index: any) => {
                  return (
                    <ListGroupItem key={index} action onClick={() => {
                      setCurrentArbitrator(element)
                      setModalOpen(!modalOpen)
                    }}>
                      <ArbitratorSummary arbitrator={element} />
                    </ListGroupItem>
                  )
                })}
              </ListGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Arbitrator Detail</ModalHeader>
        <ModalBody>
          <Row>

            <Col className="col-6 offset-3">
              {currentArbitrator.name &&
                <ListGroupItem>
                  <ArbitratorDetail arbitrator={currentArbitrator} />

                </ListGroupItem>}
            </Col>

          </Row>
        </ModalBody>
      </Modal>
    </Container>
  )
}