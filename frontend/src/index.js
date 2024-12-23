// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from '../src/redux/store';  // This should point to the correct store file
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>  {/* Wrap your app with the Provider */}
    <Router>
      <App />
    </Router>
  </Provider>
);
