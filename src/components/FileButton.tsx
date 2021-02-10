import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Spinner, FormText, Row, Col } from 'reactstrap';

import { selectors as UISelectors } from '../store/slices/ui'

export const FileButton = ({ file, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, file.key));


  return (
    <>
      {
        isActivityRunning ? (
          <FormText color="muted">
            <Row>
              <Col className="col-1">
                <Spinner size="sm" color="primary" />
              </Col>
              <Col data-cy="attachment" className="col-11">
                {file.filename}
              </Col>
            </Row>
          </FormText>
        ) : (
            <FormText color="muted">
              <Row>
                <Col data-cy="attachment" >
                  <a target="_blank" href={file.downloadUrl}>{file.filename}</a>
                </Col>
              </Row>
            </FormText>
          )
      }
    </>
  )
}