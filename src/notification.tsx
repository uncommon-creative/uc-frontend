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
      { children}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80 }}>
        {notification.visible &&
          <Container>
            <Alert color={notification.type}>
              {notification.message}
            </Alert>
          </Container>
        }
      </div>
    </>
  )
}