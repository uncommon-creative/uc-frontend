import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import runAllSagas from './sagas'

import { rootReducer } from './reducers'

export const configureStore = (preloadedState: any) => {

  const sagaMiddleware = createSagaMiddleware()
  const middlewares: any = [sagaMiddleware]

  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
    (module as any).hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  sagaMiddleware.run(runAllSagas)

  return store
}