import React from 'react';
import { type Reference } from '../../../model/gamedev';

interface ReferenceCardProps {
  reference: Reference;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{reference.value}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Origin:</span> <span className="card-text">{reference.origin}</span>
        </div>
        <div>
          <span className="card-label">Definition:</span> <span className="card-text">{reference.definition}</span>
        </div>
        <a
          className="url-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(reference.value + ' reference')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google
        </a>
        <div>
          {reference.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {reference.tags.split(',').map((tag, i) => (
                <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
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

export default ReferenceCard;
