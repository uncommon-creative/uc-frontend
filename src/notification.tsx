import { useSelector } from 'react-redux';
import {
  Alert, Container
} from 'reactstrap';

import { actions as NotificationActions, selectors as NotificationSelectors } from './store/slices/notification'

export const NotificationLayer = ({ children, ...rest }: any) => {

  const notification = useSelector(NotificationSelectors.getNotification)
  console.log('notification: ', notification);
  return (
    <>
      {children}
      {notification.visible &&
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 80, zIndex: 10000 }}>
          <Container>
            <Alert color={notification.type}>
              {notification.message}
            </Alert>
          </Container>
        </div>
      }
    </>
  )
}