import React from 'react';
import { type Purchase } from '../../../model/tracker';
import { getRankStars } from '../../../utils/contentMapper';

interface PurchaseCardProps {
  purchase: Purchase;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ purchase, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{purchase.name}</h2>
      </div>
      <div className='card-body card-body__md'>
        <div>
          <span className="card-label">Description:</span> <span className="card-text">{purchase.description}</span>
        </div>
        <div>
          <span className="card-label">Price:</span> <span className="card-text">{purchase.price}</span>
        </div>
        <div>
          <span className="card-label">Rank:</span> <span className="card-text">{getRankStars(purchase.rank)}</span>
        </div>
        <div>
          <span className="card-label">Link:</span>{' '}
          {purchase.link ? (
            <a href={purchase.link} target="_blank" rel="noopener noreferrer" className="url-link">
              Open
            </a>
          ) : null}
        </div>
        <div>
          {purchase.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {purchase.tags.split(',').map((tag: string, i: number) => (
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
            href={`https://www.google.com/search?q=${encodeURIComponent(purchase.name)}`}
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

export default PurchaseCard;
