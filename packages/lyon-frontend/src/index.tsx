import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import AppPage from 'pages/app'
import LandingPage from 'pages/landing'
import PromptViewPage from 'pages/prompt-view'
import TemplateCreatePage from 'pages/template-create'
import TemplateViewPage from 'pages/template-view'
import UserProfilePage from 'pages/user-profile'
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
  { path: '/templates/create', element: <TemplateCreatePage /> },
  { path: '/templates/:templateId', element: <TemplateViewPage /> },
  { path: '/prompts/:promptId', element: <PromptViewPage /> },
  { path: '/user/profile', element: <UserProfilePage /> },
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
