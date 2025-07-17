import { StrictMode } from 'react';
import AppRouter from './components/AppRouter';
import DemoAppRouter from './components/DemoAppRouter';
import './index.css';

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'dev';
const isDemoRoute = import.meta.env.VITE_APP_IS_DEMO === 'yes';

function App() {
  if (isDemoRoute) {
    return <DemoAppRouter />
  }

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
