import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import AppPage from 'pages/app'
import LandingPage from 'pages/landing'
import PromptPublicViewPage from 'pages/prompt-public-view'
import PromptRequesterViewPage from 'pages/prompt-requester-view'
import PromptReplierViewPage from 'pages/prompt-replier-view'
import TemplateCreatePage from 'pages/template-create'
import TemplateViewPage from 'pages/template-view'
import UserProfilePage from 'pages/user-profile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createClient, WagmiConfig } from 'wagmi'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

const client = createClient(getDefaultClient({ appName: 'Lyon' }))

const container = document.getElementById('root')!
const root = ReactDOM.createRoot(container)

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <AppPage /> },
  { path: '/templates/create', element: <TemplateCreatePage /> },
  { path: '/templates/:templateId', element: <TemplateViewPage /> },
  { path: '/prompts/:templateId/:id', element: <PromptPublicViewPage /> },
  { path: '/prompts/:templateId/:id/:sender', element: <PromptRequesterViewPage /> },
  { path: '/prompts/:templateId/:id/reply', element: <PromptReplierViewPage /> }, // need to figure out how to generate the link for repliers
  { path: '/user/profile', element: <UserProfilePage /> },
])

root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <React.StrictMode>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <RouterProvider router={router} />
        </ConnectKitProvider>
      </WagmiConfig>
    </React.StrictMode>
  // </Web3ReactProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
