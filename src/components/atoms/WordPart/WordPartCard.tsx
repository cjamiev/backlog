import React from 'react';
import { type WordPart, WORD_PART_TYPE } from '../../../model/gamedev';

interface WordPartCardProps {
  wordPart: WordPart;
  onEdit: () => void;

  onDelete: () => void;
}

const WordPartCard: React.FC<WordPartCardProps> = ({ wordPart, onEdit, onDelete }) => {
  const getTypeIcon = (type: WORD_PART_TYPE): string => {
    switch (type) {
      case WORD_PART_TYPE.SUFFIX:
        return '🔚';
      case WORD_PART_TYPE.PREFIX:
        return '🔛';
      case WORD_PART_TYPE.VOWEL:
        return '🔊';
      case WORD_PART_TYPE.CONSONANT:
        return '🔇';
      default:
        return '📝';
    }
  };

  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{wordPart.value}</h2>
        <span className="card-type">
          {getTypeIcon(wordPart.type)} {wordPart.type}
        </span>
      </div>
      <div className='card-body card-body__sm'>
        <div>
          <span className="card-label">Definition:</span>
          <span className="card-text">{wordPart.definition}</span>
        </div>
        <a
          className="url-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(wordPart.value + ' word part definition')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Search
        </a>
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

export default WordPartCard;
