import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container,
  FormText, FormGroup, Input, Label, FormFeedback,
  Col, Row, Jumbotron, InputGroup, InputGroupButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
  ListGroupItem, ListGroupItemHeading, Spinner
} from 'reactstrap';
import { useFormikContext } from 'formik';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors, SowStatus } from '../store/slices/sow'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { FileButton } from './common/FileButton';

export const SowAttachmentsInput = ({ currentSow, keyAttachment }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const attachments = useSelector(SowSelectors.getAttachments);
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const { values, setFieldValue } = useFormikContext();
  const user = useSelector(AuthSelectors.getUser)

  return (
    <>
      <FormGroup>
        <Input data-cy="inputAttachment" type="file" name="attachments" id="attachments"
          onChange={(event: any) => {
            console.log("event.target.files: ", event.target.files)
            if (event.target.files.length) {
              dispatch(SowActions.willPrepareUploadAttachment({ sow: currentSow, attachment: event.target.files[0], username: user.username, newAttachments: newAttachments, keyAttachment: keyAttachment }))
            }
          }}
        />
      </FormGroup>
      {currentSow.status == SowStatus.DRAFT && newAttachments.map((att: any, index: any) => {
        return (
          <ListGroupItem data-cy="attachmentsSow" key={index}>
            <ListGroupItemHeading>
              <Button close onClick={() => {
                dispatch(SowActions.willDeleteAttachment({ sow: currentSow, attachment: att }))
              }} />
              <FileButton file={att} />
            </ListGroupItemHeading>
          </ListGroupItem>
        )
      })}
    </>
  )
}