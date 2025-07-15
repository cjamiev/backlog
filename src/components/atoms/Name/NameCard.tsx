import React from 'react';
import { type Name } from '../../../model/library';

interface NameCardProps {
  name: Name;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
}

const NameCard: React.FC<NameCardProps> = ({ name, onEdit, onClone, onDelete }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{name.value}</h2>
      </div>
      <div>
        <span className="card-label">Gender:</span> <span className="card-text">{name.gender}</span>
      </div>
      <div>
        <span className="card-label">Origin:</span> <span className="card-text">{name.origin}</span>
      </div>
      <a
        className="url-link"
        href={`https://www.google.com/search?q=${encodeURIComponent(name.value + ' name meaning')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google
      </a>
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

export default NameCard;
