import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner, FormText, Row, Col } from 'reactstrap';

import { selectors as UISelectors } from '../store/slices/ui'

export const UploadFileButton = ({ file, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, file.key));

  return (
    <>
      {
        isActivityRunning ? (
          <FormText color="muted">
            <Row>
              <Col className="col-11">
                {file.filename}
              </Col>
              <Col className="col-1">
                <Spinner size="sm" color="primary" />
              </Col>
            </Row>
          </FormText>
        ) : (
            <FormText color="muted">
              <Row>
                <Col>{file.filename}</Col>
              </Row>
            </FormText>
          )
      }
    </>
  )
}