import React from 'react';
import type { Favorite } from '../../../model/library';

interface FavoriteListProps {
  type: string;
  filteredFavorites: Favorite[];
  onEditFavorite: (favorite: Favorite) => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({ type, filteredFavorites, onEditFavorite }) => {
  return (
        <div className="favorites-list-wrapper" key={type}>
          <h2>{type}</h2>
          <ul className="favorites-list">
            {filteredFavorites.filter(favorite => favorite.type === type).map((favorite) => (
              <li key={`${favorite.name}-${favorite.link}`} style={{ marginBottom: '0.5rem' }}>
                <span
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', marginRight: '1rem' }}
                  onClick={() => onEditFavorite(favorite)}
                >
                  {favorite.name}
                </span>
                <a href={favorite.link} target="_blank" rel="noopener noreferrer">
                  {favorite.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
  );
};

export default FavoriteList; 