import React from 'react';
import type { Book } from '../../../model/entertainment';

interface BookCardProps {
  book: Book;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{book.name}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Author: </span>
          <span className="card-text">{book.author}</span>
        </div>
        <div>
          <span className="card-label">Type: </span>
          <span className="card-text">{book.type}</span>
        </div>
        <div>
          {book.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {book.tags.split(',').map((tag: string, i: number) => (
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
            href={`https://www.google.com/search?q=${encodeURIComponent(book.name + ' book')}`}
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

export default BookCard;
