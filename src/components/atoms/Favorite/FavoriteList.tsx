import React from 'react';
import type { Favorite } from '../../../model/entertainment';

interface FavoriteListProps {
  type: string;
  filteredFavorites: Favorite[];
  onEditFavorite: (favorite: Favorite) => void;
  onDeleteFavorite: (favorite: Favorite) => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({ type, filteredFavorites, onEditFavorite, onDeleteFavorite }) => {
  if (!filteredFavorites.length) {
    return null;
  }

  return (
    <div className="favorites-list-wrapper" key={type}>
      <h2>{type}</h2>
      <ul className="favorites-list">
        {filteredFavorites.map((favorite) => (
          <li key={favorite.name} className='favorites-list-item'>
            <button
              className='primary-btn'
              onClick={() => onEditFavorite(favorite)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#fff" />
                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#fff" />
              </svg>
            </button>
            <button
              className='primary-btn'
              onClick={() => onDeleteFavorite(favorite)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>

            <a href={favorite.link} target="_blank" rel="noopener noreferrer">
              {favorite.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList; 