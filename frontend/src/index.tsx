import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('index.tsx 실행됨 - 보안 시스템 시작');

root.render(
  <HashRouter>
    <App />
  </HashRouter>
); 