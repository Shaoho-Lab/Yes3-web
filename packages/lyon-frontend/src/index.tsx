import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import AppPage from 'pages/app'
import LandingPage from 'pages/landing'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createClient, WagmiConfig } from 'wagmi'
import './index.scss'
import reportWebVitals from './reportWebVitals'

const client = createClient(getDefaultClient({ appName: 'Lyon' }))

const container = document.getElementById('root')!
const root = ReactDOM.createRoot(container)

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <AppPage /> },
])

root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <RouterProvider router={router} />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
