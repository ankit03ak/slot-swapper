import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; 
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
     <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#fff', color: '#1e293b', borderRadius: '10px', border: '1px solid #e2e8f0' },
        success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
        error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
      }}
    />  
  </BrowserRouter>
);
