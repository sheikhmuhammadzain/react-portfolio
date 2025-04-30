import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SmoothScrollProvider from './components/LocomotiveScroll'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </React.StrictMode>,
)
