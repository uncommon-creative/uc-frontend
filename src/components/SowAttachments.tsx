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

import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { UploadFileButton } from './UploadFileButton';

function pushToArray(arr: any, obj: any) {
  const index = arr.findIndex((e: any) => e.name === obj.name);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
  return arr
}

export const SowAttachments = ({ sow }: any) => {

  const dispatch = useDispatch();
  const [fileList, setFileList] = React.useState([] as any);
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <FormGroup>
        <Label for="attachments">Attachments</Label>
        <Input type="file" name="attachments" id="attachments"
          onChange={(event: any) => {
            if (event.target.files.length) {
              const newFileList = pushToArray(fileList, event.target.files[0])

              setFileList(update(fileList, { $set: newFileList }))
              setFieldValue("attachments", update(fileList, { $set: newFileList }))
              dispatch(SowActions.willUploadAttachment({ sow: sow, attachment: event.target.files[0] }))
            }
          }} />
      </FormGroup>
      {fileList.map((element: any, index: any) => {
        return (
          <ListGroupItem key={index}>
            <ListGroupItemHeading>
              <Button close onClick={() => {
                setFileList(update(fileList, { $splice: [[index, 1]] }))
                setFieldValue("attachments", update(fileList, { $splice: [[index, 1]] }))
                dispatch(SowActions.willDeleteAttachment({ sow: sow, attachment: element }))
              }} />
              <UploadFileButton name={element.name} />
            </ListGroupItemHeading>
          </ListGroupItem>
        )
      })}
    </>
  )
}