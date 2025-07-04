import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        headings: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        },
        colors: {
          blue: [
            '#f0f9ff',
            '#e0f2fe',
            '#bae6fd',
            '#7dd3fc',
            '#38bdf8',
            '#0ea5e9',
            '#0284c7',
            '#0369a1',
            '#075985',
            '#0c4a6e'
          ]
        },
        components: {
          Button: {
            defaultProps: {
              radius: 'md',
            },
          },
          Card: {
            defaultProps: {
              radius: 'md',
              shadow: 'sm',
            },
          },
          TextInput: {
            defaultProps: {
              radius: 'md',
            },
          },
          Select: {
            defaultProps: {
              radius: 'md',
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
