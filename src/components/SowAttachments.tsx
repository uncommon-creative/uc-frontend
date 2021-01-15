import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container,
  FormText, FormGroup, Input, Label, FormFeedback,
  Col, Row, Jumbotron, InputGroup, InputGroupButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
  ListGroupItem, ListGroupItemHeading
} from 'reactstrap';
import { useFormikContext } from 'formik';
import update from 'immutability-helper';

import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { ActivityButton } from './ActivityButton';

export const SowAttachments = () => {

  const dispatch = useDispatch();
  const [fileList, setFileList] = React.useState([] as any);

  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <FormGroup>
        <Label for="attachments">Attachments</Label>
        <Input type="file" name="attachments" id="attachments"
          onChange={(event: any) => {
            console.log("attachments onChange", event.target.files[0])
            setFileList(update(fileList, { $push: [event.target.files[0]] }))
            setFieldValue("attachments", update(fileList, { $push: [event.target.files[0]] }))
          }} />
        {/* <FormText color="muted">
          Attachments
        </FormText> */}
      </FormGroup>
      {fileList.map((element: any, index: any) => {
        return (
          <ListGroupItem key={index}>
            <ListGroupItemHeading>
              <Button close onClick={() => {
                setFileList(update(fileList, { $splice: [[index, 1]] }))
                setFieldValue("attachments", update(fileList, { $splice: [[index, 1]] }))
              }} />
            </ListGroupItemHeading>
            <FormText color="muted">{element.name}</FormText>
          </ListGroupItem>
        )
      })}
    </>
  )
}