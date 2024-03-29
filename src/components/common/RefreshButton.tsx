import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'

import { selectors as UISelectors } from '../../store/slices/ui'

export const RefreshButton = ({ name, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, name));

  return (
    <>
      {
        isActivityRunning ? (
          <Button disabled {...rest} outline><Spinner size="sm" color="primary" /></Button >
        ) : (
            <Button disabled={disabled} {...rest} outline><FontAwesomeIcon icon={faRedo} /></Button >
          )
      }
    </>
  )
}