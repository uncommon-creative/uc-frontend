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
import { selectors as UISelectors } from '../store/slices/ui'

export const ArbitratorsListPage = () => {

  const dispatch = useDispatch();
  const isLoading = useSelector(UISelectors.isLoading)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)

  const toggleModal = () => setModalOpen(!modalOpen);

  React.useEffect(() => {
    dispatch(ArbitratorActions.willGetFullArbitratorsList())
    console.log("in FullArbitratorsList: ", arbitratorsList)
  }, []);

  return (
    <>
      {!isLoading &&
        <Container>
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="text-center">Arbitrators List</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted text-center">List of arbitrators</CardSubtitle>

              <Row>
                <Col className="col-12">
                  <ListGroup>
                    {arbitratorsList.map((element: any, index: any) => {
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
                  <ListGroupItem>
                    <ArbitratorDetail arbitrator={currentArbitrator} />

                  </ListGroupItem>
                </Col>

              </Row>
            </ModalBody>
          </Modal>
        </Container>
      }
    </>
  )
}