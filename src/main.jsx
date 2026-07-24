import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import SmoothScrollProvider from './components/SmoothScrollProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
