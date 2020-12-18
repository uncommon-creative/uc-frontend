import React from 'react';
import './App.scss';

import { Provider } from 'react-redux'
import { configureStore, history } from './store'
import { AppRouter } from './router'
import { NotificationLayer } from './notification'
import { ConnectedRouter } from 'connected-react-router'

function App() {
  return (
    <Provider store={configureStore({})}>
      <ConnectedRouter history={history}>
      <NotificationLayer>
        <AppRouter />
      </NotificationLayer>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
