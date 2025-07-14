import { StorageProvider } from './context/StorageContext';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <StorageProvider>
      <AppRouter />
    </StorageProvider>
  );
}

export default App;
