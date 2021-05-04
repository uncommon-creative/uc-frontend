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
import { ActivityButton } from '../common/ActivityButton';

export const ArbitratorsSelect = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const currentSelectedArbitrators = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrators)
  const currentSelectedArbitrator = useSelector(ArbitratorSelectors.getCurrentSelectedArbitrator)

  const { values, setFieldValue } = useFormikContext();

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} scrollable={true}>
      <ModalHeader toggle={toggle}>Select an arbitrator</ModalHeader>
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
        {currentSelectedArbitrator.user &&
          <Col className="col-3">
            <ArbitratorDetailXS arbitrator={currentSelectedArbitrator} />
          </Col>
        }
        <Col className="col-2">
          <ActivityButton data-cy='inputSowArbitratorsConfirm' disabled={!currentSelectedArbitrator.user} name="confirmArbitrators" color="primary" onClick={() => {
            setFieldValue('arbitrator', currentSelectedArbitrator)
            dispatch(SowActions.willSelectArbitrator({ arbitrator: currentSelectedArbitrator }))
            toggle()
          }}>Confirm</ActivityButton>
        </Col>
      </ModalFooter>
    </Modal>
  )
}