import * as React from 'react';
import {
  Card, CardText, CardBody, CardTitle, CardSubtitle,
  Button, Container, Col, Row,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem,
  FormGroup, Label, Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ArbitratorsList } from '../components/arbitrator/ArbitratorList'
import { selectors as UISelectors } from '../store/slices/ui'

export const ArbitratorsPage = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isLoading = useSelector(UISelectors.isLoading)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentArbitrator, setCurrentArbitrator] = React.useState({} as any);
  // const arbitratorsList = useSelector(ArbitratorSelectors.getArbitratorsList)


  React.useEffect(() => {
    dispatch(ArbitratorActions.willGetFullArbitratorsList())
    // console.log("in FullArbitratorsList: ", arbitratorsList)
  }, []);

  return (
    <>
      <Container>
        <Card>
          <CardTitle tag="h5" className="text-center">Arbitrators List</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">List of arbitrators</CardSubtitle>

          <CardBody>
            <FormGroup>
              <Label hidden for="arbitratorSearch">{t('arbitrator.input.arbitratorSearchLabel')}</Label>
              <Input
                type="search"
                name="arbitratorSearch"
                id="arbitratorSearch"
                placeholder={t('arbitrator.input.arbitratorSearchPlaceholder')}
              />
            </FormGroup>

            <ArbitratorsList />
          </CardBody>
        </Card>
      </Container>
    </>
  )
}