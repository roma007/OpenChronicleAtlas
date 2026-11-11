import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/system/ErrorBoundary';
import { installGlobalErrorHandlers } from './lib/observability';
import './styles/globals.css';

installGlobalErrorHandlers();

const isDesktop = import.meta.env.MODE === 'desktop';
const Router = isDesktop ? HashRouter : BrowserRouter;

if (isDesktop) {
  void import('./lib/desktop').then(({ installDesktopLinkHandler }) => {
    installDesktopLinkHandler();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  </React.StrictMode>,
);
