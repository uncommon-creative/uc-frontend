import * as React from 'react';
import { useFormikContext } from 'formik';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var _ = require('lodash');

export const DescriptionEditor = ({ description }: any) => {


  let editorStateCB = EditorState.createEmpty()
  const contentBlock = htmlToDraft(description);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    editorStateCB = EditorState.createWithContent(contentState);
  }

  const [editorState, setEditorState] = React.useState(editorStateCB)

  const { values, setFieldValue } = useFormikContext();

  const updateRaw = _.debounce((editorState: any) => {
    const rawDescription = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setFieldValue('description', rawDescription)
  }, 1000, { maxWait: 4000 });

  const onEditorStateChange = (editorState: any) => {
    updateRaw(editorState);
    setEditorState(editorState);
  }

  return (
    <Editor
      data-cy="inputSowDescription" 
      wrapperStyle={{ border: "1px solid #ced4da", borderRadius: '0.25rem' }}
      toolbarStyle={{ borderTop: 0, borderLeft: 0, borderRight: 0 }}
      editorStyle={{ padding: "0.375rem 0.75rem", height: 200 }}
      editorState={editorState}
      onEditorStateChange={(editorState: any) => onEditorStateChange(editorState)}
    />
  )
}