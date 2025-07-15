import React from 'react';
import { type Favorite } from '../../../model/library';

interface FavoriteCardProps {
  favorite: Favorite;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{favorite.name}</h2>
        <span className="card-type">
          {favorite.type}
        </span>
      </div>
      {favorite.notes && (
        <div>
          <span className="card-label">Notes:</span>
          <span className="card-text">{favorite.notes}</span>
        </div>
      )}
      <a className="url-link" href={favorite.link} target="_blank" rel="noopener noreferrer">
        Visit Link
      </a>
      <div>
        {favorite.tags.length ? (
          <div className="tags-container">
            <span className="card-label">Tags:</span>
            {favorite.tags.split(',').map((tag, i) => (
              <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="card-footer">
        <button className="primary-btn" onClick={onClone}>
          Clone
        </button>
        <button className="primary-btn" onClick={onEdit}>
          Edit
        </button>
        <button className="negative-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default FavoriteCard;
