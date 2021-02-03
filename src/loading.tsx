import { useSelector } from 'react-redux';
import {
  Alert, Container, Spinner
} from 'reactstrap';

import { actions as NotificationActions, selectors as NotificationSelectors } from './store/slices/notification'
import { actions as UIActions, selectors as UISelectors } from './store/slices/ui'

export const LoadingLayer = ({ children, ...rest }: any) => {

  const isLoading = useSelector(UISelectors.isLoading)
  console.log('isLoading: ', isLoading);
  return (
    <>
      {children}
      {isLoading &&
        <div style={{ position: "relative", bottom: 0, left: 0, right: 0, height: '100%', zIndex: 10 }}>
          <Container>
            <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
          </Container>
        </div>
      }
    </>
  )
}