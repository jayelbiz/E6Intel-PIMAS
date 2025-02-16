import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import PrimeReact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Import Bootstrap and custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/theme.scss';
import './styles/animations.css';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);