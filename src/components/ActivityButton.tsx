import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner } from 'reactstrap';

import { selectors as UISelectors } from '../store/slices/ui'

export const ActivityButton = ({name, disabled, children, ...rest}: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, name));

  return (
    <>
    {
      isActivityRunning ?(
        < Button disabled {...rest}>{children}  <Spinner size = "sm" color = "light" /></Button >
      ): (
        < Button {...rest}>{children}</Button >
        )
    }
    </>
  )
}