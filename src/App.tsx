import { StrictMode } from 'react';
import AppRouter from './components/AppRouter';
import './index.css';
import { getIsDemoMode, getIsDevMode } from './utils/config';
import { initializeApp } from './utils/demoUtils';

function App() {
  if (getIsDemoMode()) {
    initializeApp();
  }
  if (getIsDevMode()) {
    return (
      <StrictMode>
        <AppRouter />
      </StrictMode>
    );
  }

  return (
    <AppRouter />
  );
}

export default App;
