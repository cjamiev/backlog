import { StrictMode } from 'react';
import AppRouter from './components/AppRouter';
import './index.css';

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'dev';

function App() {
  if (isDevelopmentMode) {
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
