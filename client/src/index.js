import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './services/axios.js';
// import CurrentContract from './Context/ContractsContext';

ReactDOM.render(
  <React.StrictMode>
    {/* <CurrentContract> */}
      <App />
    {/* </CurrentContract>, */}
  </React.StrictMode>,
  document.getElementById('root')
);
