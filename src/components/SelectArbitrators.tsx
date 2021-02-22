import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import { useFormikContext } from 'formik';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ActivityButton } from './common/ActivityButton';

export const SelectArbitrators = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  const [selectedArbitrators, setSelectedArbitrators] = React.useState([] as any);
  const currentArbitrators = useSelector(SowSelectors.getCurrentArbitrators);
  const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)

  const { values, setFieldValue } = useFormikContext();

  React.useEffect(() => {
    if (modal) {
      setSelectedArbitrators(currentArbitrators)
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
              {arbitratorsList.map((element: any, index: any) => {
                return (
                  <ListGroupItem key={element.user} action onClick={() => setCurrentArbitrator(element)}>
                    <ArbitratorSummary arbitrator={element} />
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Col>
          <Col className="col-md-6 col-12">
            <Row>
              <Col className="col-12">
                {currentArbitrator.given_name &&
                  <ListGroupItem>
                    <ArbitratorDetail arbitrator={currentArbitrator} />
                    {selectedArbitrators.includes(currentArbitrator) ?
                      <Button disabled block color="primary">Arbitrator added</Button>
                      :
                      selectedArbitrators.length < 3 ?
                        <Button data-cy='inputSowArbitratorsAdd' block color="primary" onClick={() => {
                          setSelectedArbitrators(update(selectedArbitrators, { $push: [currentArbitrator] }))
                        }}>Add to arbitrators</Button>
                        :
                        <Button disabled block color="primary">Max number of Arbitrators selected</Button>
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
        <ActivityButton data-cy='inputSowArbitratorsConfirm' disabled={selectedArbitrators.length == 3 ? false : true} name="confirmArbitrators" color="primary" onClick={() => {
          setFieldValue('arbitrators', selectedArbitrators)
          dispatch(SowActions.willConfirmArbitrators({ arbitrators: update(selectedArbitrators, {}), toggle: toggle }))
        }}>Confirm arbitrators</ActivityButton>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}