import { Routes, Route, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SongPage from './pages/SongPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import WordPage from './pages/WordPage';
import ConstructedWordPage from './pages/ConstructedWordPage';
import NamePage from './pages/NamePage';
import IntervalPage from './pages/IntervalPage';
import PhrasePage from './pages/PhrasePage';
import ReferencePage from './pages/ReferencePage';
import GamePage from './pages/GamePage';
import BookPage from './pages/BookPage';
import FilmPage from './pages/FilmPage';
import ShowsPage from './pages/ShowsPage';
import PurchasePage from './pages/PurchasePage';
import ProjectPage from './pages/ProjectPage';
import PasswordPage from './pages/PasswordPage';
import CountdownPage from './pages/CountdownPage';
import FavoritePage from './pages/FavoritePage';
import WordPartPage from './pages/WordPartPage';
import ContactPage from './pages/ContactPage';
import NotePage from './pages/NotePage';
import Navigation from './Navigation';
import ErrorPage from './pages/ErrorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 600000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/words" element={<WordPage />} />
          <Route path="/constructed-words" element={<ConstructedWordPage />} />
          <Route path="/wordparts" element={<WordPartPage />} />
          <Route path="/phrases" element={<PhrasePage />} />
          <Route path="/references" element={<ReferencePage />} />
          <Route path="/names" element={<NamePage />} />
          <Route path="/intervals" element={<IntervalPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/songs" element={<SongPage />} />
          <Route path="/films" element={<FilmPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/passwords" element={<PasswordPage />} />
          <Route path="/countdowns" element={<CountdownPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/notes" element={<NotePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default AppRouter;
