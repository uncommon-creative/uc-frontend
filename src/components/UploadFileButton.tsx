import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner, FormText, Row, Col } from 'reactstrap';

import { selectors as UISelectors } from '../store/slices/ui'

export const UploadFileButton = ({ name, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, name));

  return (
    <>
      {
        isActivityRunning ? (
          <FormText color="muted">
            <Row>
              <Col className="col-11">
                {name}
              </Col>
              <Col className="col-1">
                <Spinner size="sm" color="primary" />
              </Col>
            </Row>
          </FormText>
        ) : (
            <FormText color="muted">
              <Row>
                <Col>{name}</Col>
              </Row>
            </FormText>
          )
      }
    </>
  )
}