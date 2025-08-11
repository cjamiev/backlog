import React from 'react';
import { type Interval } from '../../../model/gamedev';

interface IntervalCardProps {
  interval: Interval;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const IntervalCard: React.FC<IntervalCardProps> = ({ interval, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper card-with-details-wrapper2">
      <div className="card-header">
        <h2 className="card-title">{interval.name}</h2>
        <span className="card-label">Is Complete:</span> <span className="card-text">{interval.isCompleted ? 'Yes' : 'Nope'}</span>
      </div>
      <div className='card-body card-body-with-details'>
        <div>
          <span className="card-label">Origin:</span> <span className="card-text">{interval.origin}</span>
        </div>
        <div>
          <span className="card-label">Links:</span>
          {interval.links.split(',').map((link, index) => {
            return <a
              key={link}
              className="url-link"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {index === 0 ? 'Main Link' : 'Alternative ' + index}
            </a>
          })}
        </div>
        <div>
          <span className="card-label">Details:</span>
          <pre className='card-details'>
            {interval.details}
          </pre>
        </div>
        <a
          className="url-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(interval.name + ' song')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google
        </a>
        <div>
          {interval.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {interval.tags.split(',').map((tag, i) => (
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

export default IntervalCard;
