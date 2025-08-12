import React from 'react';
import { type Interval } from '../../../model/gamedev';

interface IntervalCardProps {
  interval: Interval;
  onEdit: () => void;

  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const IntervalCard: React.FC<IntervalCardProps> = ({ interval, onEdit, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{interval.name}</h2>
      </div>
      <div className='card-body card-body__lg'>
        <div>
          <span className="card-label">Origin:</span> <span className="card-text">{interval.origin}</span>
        </div>
        <div>
          <span className="card-label">Links:</span>
          <a
            className="url-link"
            href={`https://www.google.com/search?q=${encodeURIComponent(interval.name + ' song')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            G
          </a>
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
