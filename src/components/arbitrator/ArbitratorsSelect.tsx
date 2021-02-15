import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormGroup, Label, Input,
  Button, Col, Row, Card, CardImg, CardText,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import { useFormikContext } from 'formik';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors } from '../../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { ArbitratorsList } from './ArbitratorList'
import { ArbitratorDetailXS } from './ArbitratorDetailXS'
import { ActivityButton } from '../ActivityButton';

export const ArbitratorsSelect = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const currentSelectedArbitrators = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrators)

  const { values, setFieldValue } = useFormikContext();

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Select three arbitrators</ModalHeader>
      <ModalBody>
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

      </ModalBody>
      <ModalFooter>
        <Row className="d-flex justify-content-end">
          {currentSelectedArbitrators.map((element: any, index: any) => {
            return (
              <Col className="col-3">
                <ArbitratorDetailXS arbitrator={element} index={index} />
              </Col>
            )
          })}
          <Col className="col-3">
            <ActivityButton data-cy='inputSowArbitratorsConfirm' disabled={currentSelectedArbitrators.length == 3 ? false : true} name="confirmArbitrators" color="primary" onClick={() => {
              setFieldValue('arbitrators', currentSelectedArbitrators)
              dispatch(SowActions.willConfirmArbitrators({ arbitrators: update(currentSelectedArbitrators, {}), toggle: toggle }))
            }}>Confirm</ActivityButton>
          </Col>
        </Row>
      </ModalFooter>
    </Modal>
  )
}