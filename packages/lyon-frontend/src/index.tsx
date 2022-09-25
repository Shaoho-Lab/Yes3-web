import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import LandingPage from 'pages/landing'
import PromptPublicViewPage from 'pages/prompt-public-view'
import PromptReplierViewPage from 'pages/prompt-replier-view'
import PromptRequesterViewPage from 'pages/prompt-requester-view'
import TemplateCreatePage from 'pages/template-create'
import TemplateListPage from 'pages/template-list'
import TemplateViewPage from 'pages/template-view'
import UserProfilePage from 'pages/user-profile'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createClient, WagmiConfig } from 'wagmi'
import './index.scss'
import reportWebVitals from './reportWebVitals'

const client = createClient(getDefaultClient({ appName: 'Yes3' }))

const container = document.getElementById('root')!
const root = ReactDOM.createRoot(container)

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/templates', element: <TemplateListPage /> },
  { path: '/templates/:templateId', element: <TemplateViewPage /> },
  { path: '/templates/create', element: <TemplateCreatePage /> },
  { path: '/prompts/:templateId/:id', element: <PromptPublicViewPage /> },
  {
    path: '/prompts/:templateId/:id/sender',
    element: <PromptRequesterViewPage />,
  },
  {
    path: '/prompts/:templateId/:id/reply',
    element: <PromptReplierViewPage />,
  },
  { path: '/users/:address', element: <UserProfilePage /> },
])

root.render(
  <WagmiConfig client={client}>
    <ConnectKitProvider>
      <ChakraProvider
        theme={extendTheme({
          fonts: {
            heading: `'Ubuntu', sans-serif`,
            body: `'Ubuntu', sans-serif`,
          },
        })}
      >
        <RouterProvider router={router} />
      </ChakraProvider>
    </ConnectKitProvider>
  </WagmiConfig>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
