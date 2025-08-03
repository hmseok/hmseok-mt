import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('index.tsx 실행됨');

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
); 