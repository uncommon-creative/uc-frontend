import React from 'react';
import './App.scss';

import { Provider } from 'react-redux'
import { configureStore } from './store'
import { AppRouter } from './router'

function App() {
  return (
    <Provider store={configureStore({})}>
      <AppRouter />
    </Provider>
  );
}

export default App;
