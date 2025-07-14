import React from 'react';
import { type Favorite, FAVORITE_TYPE } from '../../../model/library';

interface FavoriteCardProps {
  favorite: Favorite;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onEdit, onClone, onDelete, onHandleClickTag }) => {
  const getTypeLabel = (type: FAVORITE_TYPE): string => {
    switch (type) {
      case FAVORITE_TYPE.art:
        return 'Art';
      case FAVORITE_TYPE.music:
        return 'Music';
      case FAVORITE_TYPE.game:
        return 'Game';
      case FAVORITE_TYPE.programming:
        return 'Programming';
      case FAVORITE_TYPE.entertainment:
        return 'Entertainment';
      case FAVORITE_TYPE.other:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const getTypeIcon = (type: FAVORITE_TYPE): string => {
    switch (type) {
      case FAVORITE_TYPE.art:
        return '🎨';
      case FAVORITE_TYPE.music:
        return '🎵';
      case FAVORITE_TYPE.game:
        return '🎮';
      case FAVORITE_TYPE.programming:
        return '💻';
      case FAVORITE_TYPE.entertainment:
        return '🎬';
      case FAVORITE_TYPE.other:
        return '⭐';
      default:
        return '📌';
    }
  };

  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{favorite.name}</h2>
        <span className="card-type">
          {getTypeIcon(favorite.type)} {getTypeLabel(favorite.type)}
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
