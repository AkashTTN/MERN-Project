import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import authReducer from '../src/store/reducers/auth'
import buzzReducer from '../src/store/reducers/buzz'
import complaintReducer from '../src/store/reducers/complaint'
import formReducer from '../src/store/reducers/form'
import imagesReducer from '../src/store/reducers/images'

import App from './components/App/App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

import './index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  authData: authReducer,
  buzz: buzzReducer,
  complaint: complaintReducer,
  form: formReducer,
  images: imagesReducer
})

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))


ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);