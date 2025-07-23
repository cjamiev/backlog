import React from 'react';
import { type Word } from '../../../model/library';

interface WordCardProps {
  word: Word;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{word.value}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Definition:</span> <span className="card-text">{word.definition}</span>
        </div>
        <div>
          <span className="card-label">Type:</span> <span className="card-text">{word.type}</span>
        </div>
        <a
          className="url-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(word.value + ' definition')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google
        </a>
        <div>
          {word.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {word.tags.split(',').map((tag, i) => (
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

export default WordCard;
