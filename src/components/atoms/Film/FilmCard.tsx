import React from 'react';
import { type Film } from '../../../model/entertainment';
import { getRankStars } from '../../../utils/contentMapper';

interface FilmCardProps {
  film: Film;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{film.name}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Rank:</span> <span className="card-text">{getRankStars(film.rank)}</span>
        </div>
        <div>
          <span className="card-label">Service: </span>
          <span className="card-text">{film.service}</span>
        </div>
        <div>
          {film.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {film.tags.split(',').map((tag, i) => (
                <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className='link-wrapper'>
          <a
            className="url-link"
            href={`https://www.google.com/search?q=${encodeURIComponent(film.name + ' movie')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google
          </a>
        </div>
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

export default FilmCard;
