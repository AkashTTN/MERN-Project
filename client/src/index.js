import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import authReducer from '../src/store/reducers/auth'
import buzzReducer from '../src/store/reducers/buzz'
import complaintReducer from '../src/store/reducers/complaint'
import formReducer from '../src/store/reducers/form'

import App from './components/App/App';

import './index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  authData: authReducer,
  buzz: buzzReducer,
  complaint: complaintReducer,
  form: formReducer
})

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);