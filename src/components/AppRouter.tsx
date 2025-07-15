import SongPage from './pages/SongPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WordPage from './pages/WordPage';
import ConstructedWordPage from './pages/ConstructedWordPage';
import NamePage from './pages/NamePage';
import ConstructedNamePage from './pages/ConstructedNamePage';
import PhrasePage from './pages/PhrasePage';
import ReferencePage from './pages/ReferencePage';
import GamePage from './pages/GamePage';
import BookPage from './pages/BookPage';
import FilmPage from './pages/FilmPage';
import ShowsPage from './pages/ShowsPage';
import ProjectPage from './pages/ProjectPage';
import PasswordPage from './pages/PasswordPage';
import CountdownPage from './pages/CountdownPage';
import FavoritePage from './pages/FavoritePage';
import WordPartPage from './pages/WordPartPage';

function App() {
  return (
    <Router>
      <nav className="page-nav">
        <Link to="/">Home</Link>
        <Link to="/words">Words</Link>
        <Link to="/constructed-words">Constructed Words</Link>
        <Link to="/wordparts">Word Parts</Link>
        <Link to="/phrases">Phrases</Link>
        <Link to="/references">References</Link>
        <Link to="/names">Names</Link>
        <Link to="/constructed-names">Construced Names</Link>
        <Link to="/games">Games</Link>
        <Link to="/songs">Songs</Link>
        <Link to="/films">Films</Link>
        <Link to="/shows">Shows</Link>
        <Link to="/books">Books</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/passwords">Passwords</Link>
        <Link to="/countdowns">Countdowns</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/words" element={<WordPage />} />
        <Route path="/constructed-words" element={<ConstructedWordPage />} />
        <Route path="/wordparts" element={<WordPartPage />} />
        <Route path="/phrases" element={<PhrasePage />} />
        <Route path="/references" element={<ReferencePage />} />
        <Route path="/names" element={<NamePage />} />
        <Route path="/constructed-names" element={<ConstructedNamePage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/songs" element={<SongPage />} />
        <Route path="/films" element={<FilmPage />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/passwords" element={<PasswordPage />} />
        <Route path="/countdowns" element={<CountdownPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
