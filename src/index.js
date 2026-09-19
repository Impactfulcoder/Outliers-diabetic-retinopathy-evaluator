import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App';

// Suppress the benign "ResizeObserver loop completed with undelivered notifications"
// warning. It's a browser-level race (an observer callback changed layout before the
// frame painted), never an app error — the next frame delivers the missed notifications.
// Chrome shipped it as a non-NamespaceError exception in some versions, hence the fallback.
const RESIZE_OBSERVER_MSGS = [
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded',
];
const isResizeObserverNoise = (message) =>
  RESIZE_OBSERVER_MSGS.some((msg) => message?.includes?.(msg));
window.addEventListener('error', (event) => {
  if (isResizeObserverNoise(event.message)) {
    event.stopImmediatePropagation();
  }
});
window.addEventListener('unhandledrejection', (event) => {
  if (isResizeObserverNoise(String(event.reason))) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
