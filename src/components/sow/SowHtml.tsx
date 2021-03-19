import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle, Badge,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { ActivityButton } from '../common/ActivityButton';

export const SowHtml = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const html = useSelector(SowSelectors.getHtml)
  const users = useSelector(ProfileSelectors.getUsers)

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">

      <ModalHeader toggle={toggle}>
        <CardTitle className="">{currentSow.title}</CardTitle>
        <CardSubtitle tag="h6" className="text-muted">{currentSow.sow}</CardSubtitle>
      </ModalHeader>
      <ModalBody id='printSection'>
        <Jumbotron>
          <CardText className="my-1" name="html" id="html">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </CardText>
        </Jumbotron>
      </ModalBody>
      <ModalFooter>
        <ActivityButton data-cy='closeHtml' name="closeHtml" outline color="primary" onClick={() => {
          dispatch(SowActions.didBuildHtml(''))
        }}>Close</ActivityButton>
        {/* <ActivityButton name="printHtml" color="primary" onClick={() => {
          window.print()
        }}>Download document</ActivityButton> */}
      </ModalFooter>
    </Modal>
  )
}