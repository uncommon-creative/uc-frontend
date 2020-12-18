import React from 'react';
import './App.scss';

import { Provider } from 'react-redux'
import { configureStore, history } from './store'
import { AppRouter } from './router'
import { NotificationLayer } from './notification'

function App() {
  return (
    <Provider store={configureStore({})}>
      <NotificationLayer>
        <AppRouter />
      </NotificationLayer>
    </Provider>
  );
}

export default App;
