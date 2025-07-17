import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeDemoPage from './demo/HomeDemoPage';
import SongDemoPage from './pages/SongPage';
import ShowsDemoPage from './demo/ShowsDemoPage';
import ProjectDemoPage from './demo/ProjectDemoPage';
import CountdownDemoPage from './demo/CountdownDemoPage';
import FavoriteDemoPage from './demo/FavoriteDemoPage';

function DemoAppRouter() {
  return (
    <Router>
      <nav className="page-nav">
        <Link to="/demo">Home</Link>
        <Link to="/demo-songs">Songs</Link>
        <Link to="/demo-shows">Shows</Link>
        <Link to="/demo-projects">Projects</Link>
        <Link to="/demo-countdowns">Countdowns</Link>
        <Link to="/demo-favorites">Favorites</Link>
      </nav>
      <Routes>
        <Route path="/demo" element={<HomeDemoPage />} />
        <Route path="/demo-songs" element={<SongDemoPage />} />
        <Route path="/demo-shows" element={<ShowsDemoPage />} />
        <Route path="/demo-projects" element={<ProjectDemoPage />} />
        <Route path="/demo-countdowns" element={<CountdownDemoPage />} />
        <Route path="/demo-favorites" element={<FavoriteDemoPage />} />
      </Routes>
    </Router>
  );
}

export default DemoAppRouter;
