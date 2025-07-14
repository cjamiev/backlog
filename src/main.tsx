import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'dev';

if (isDevelopmentMode) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById('root')!).render(<App />);
}
