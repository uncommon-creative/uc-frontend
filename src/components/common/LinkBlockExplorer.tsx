import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { faCopy as farCopy } from '@fortawesome/free-regular-svg-icons'

import { configuration } from '../../config'
import { actions as NotificationActions } from '../../store/slices/notification'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const LinkBlockExplorer = ({ title, type, id }: any) => {

  const dispatch = useDispatch();

  const url = configuration[stage].AlgoExplorer_link[type] + id

  return (
    <Row className='mt-1 m-0 align-items-center'>
      <Col className="col-auto p-0">
        <a target="_blank" href={url}>
          {title}
        </a>
      </Col>
      <Col className="col-1 p-0 d-flex justify-content-center">
        <a target="_blank" className="d-flex justify-content-center"
          href={url}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size='1x' />
        </a>
      </Col>
      <Col className="col-1 p-0 d-flex justify-content-center">
        <FontAwesomeIcon icon={farCopy} size='1x' className="text-primary"
          onClick={() => {
            navigator.clipboard.writeText(id)
            dispatch(NotificationActions.willShowNotification({ message: type + ' "' + id + '" copied to clipboard', type: "info" }));
          }}
        />
      </Col>
    </Row>
  )
}