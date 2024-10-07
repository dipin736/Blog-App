import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './components/AuthProvider.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
