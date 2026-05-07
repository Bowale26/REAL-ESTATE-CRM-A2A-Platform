import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global catch to prevent "Blank Screen" on WebSocket failures
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('WebSocket')) {
    event.preventDefault();
    console.warn("HMR Connection lost. This is normal in production environments.");
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
