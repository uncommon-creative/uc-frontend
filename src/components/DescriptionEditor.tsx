import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Label,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var _ = require('lodash');

export const DescriptionEditor = () => {

  const dispatch = useDispatch();
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

  const { values, setFieldValue } = useFormikContext();

  const updateRaw = _.debounce((editorState: any) => {
    const rawDescription = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setFieldValue('description', rawDescription)
    // dispatch(DesignActions.setDesignMetadata({ name: 'description', value: rawDescription }))
  }, 1000, { maxWait: 4000 });

  const onEditorStateChange = (editorState: any) => {
    updateRaw(editorState);
    setEditorState(editorState);
  }

  return (
    <Editor
      wrapperStyle={{ border: "1px solid #ced4da", borderRadius: '0.25rem' }}
      toolbarStyle={{ /* display: readOnly ? 'none' : '' ,*/ borderTop: 0, borderLeft: 0, borderRight: 0 }}
      editorStyle={{ padding: "0.375rem 0.75rem", height: 200, /* backgroundColor: readOnly ? 'rgba(249, 249, 249, 255)' : "#fff"  */ }}
      editorState={editorState}
      // readOnly={readOnly}
      onEditorStateChange={(editorState: any) => onEditorStateChange(editorState)}
    />
    // <Input name="description" type="textarea" placeholder={t('Descrizione')} tag={Field} />
  )
}