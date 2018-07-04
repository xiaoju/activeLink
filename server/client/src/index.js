import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import { createBrowserHistory } from 'history';
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from 'connected-react-router';

import './index.css';

import App from './components/App';
import reducers from './reducers';

import unregister from './registerServiceWorker';

const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(reducers),
  {},
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      reduxThunk
    )
  )
);

ReactDOM.render(
  <Provider store={store}>
    <div className="container">
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </div>
  </Provider>,
  document.querySelector('#root')
);

unregister();

// console.log('STRIPE KEY IS', process.env.REACT_APP_STRIPE_KEY);
// console.log('Environment is', process.env.NODE_ENV);
