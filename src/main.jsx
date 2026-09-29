import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { registerOffline } from '@/lib/offline.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

// Makes the built app installable and playable offline. Does nothing in
// development, and never throws if the browser cannot support it.
registerOffline()
