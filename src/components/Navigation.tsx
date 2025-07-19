import { Link } from 'react-router-dom';
import { useState } from 'react';

const isPasswordReady = false

function Navigation() {
  const [isGamedevHovered, setIsGamedevHovered] = useState(false);
  const [isEntertainmentHovered, setIsEntertainmentHovered] = useState(false);
  const [isTrackerHovered, setIsTrackerHovered] = useState(false);

  return (
    <nav className="nav-wrapper">
      <Link to="/">Home</Link>
      <div
        className="nav-item-with-submenu"
        onMouseEnter={() => setIsGamedevHovered(true)}
        onMouseLeave={() => setIsGamedevHovered(false)}
      >
        <span className="nav-link">Gamedev</span>
        {isGamedevHovered && (
          <div className="submenu">
            <Link to="/words">Words</Link>
            <Link to="/constructed-words">Constructed Words</Link>
            <Link to="/wordparts">Word Parts</Link>
            <Link to="/phrases">Phrases</Link>
            <Link to="/references">References</Link>
            <Link to="/names">Names</Link>
            <Link to="/constructed-names">Constructed Names</Link>
          </div>
        )}
      </div>
      <div
        className="nav-item-with-submenu"
        onMouseEnter={() => setIsEntertainmentHovered(true)}
        onMouseLeave={() => setIsEntertainmentHovered(false)}
      >
        <span className="nav-link">Entertainment</span>
        {isEntertainmentHovered && (
          <div className="submenu">
            <Link to="/games">Games</Link>
            <Link to="/songs">Songs</Link>
            <Link to="/films">Films</Link>
            <Link to="/shows">Shows</Link>
            <Link to="/books">Books</Link>
            <Link to="/favorites">Favorites</Link>
          </div>
        )}
      </div>
      <div
        className="nav-item-with-submenu"
        onMouseEnter={() => setIsTrackerHovered(true)}
        onMouseLeave={() => setIsTrackerHovered(false)}
      >
        <span className="nav-link">Tracker</span>
        {isTrackerHovered && (
          <div className="submenu">
            <Link to="/projects">Projects</Link>
            {isPasswordReady && <Link to="/passwords">Passwords</Link>}
            <Link to="/countdowns">Countdowns</Link>
            <Link to="/contacts">Contacts</Link>
            <Link to="/notes">Notes</Link>
          </div>
        )}
      </div>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

export default Navigation;
