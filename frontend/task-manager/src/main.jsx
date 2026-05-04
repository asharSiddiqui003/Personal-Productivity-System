import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import React from "react";
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
