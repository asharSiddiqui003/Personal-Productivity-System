import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "not-configured"}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

