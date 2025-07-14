import React from 'react';
import { type WordPart, WORD_PART_TYPE } from '../../../model/library';

interface WordPartCardProps {
  wordPart: WordPart;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
}

const WordPartCard: React.FC<WordPartCardProps> = ({ wordPart, onEdit, onClone, onDelete }) => {
  const getTypeLabel = (type: WORD_PART_TYPE): string => {
    switch (type) {
      case WORD_PART_TYPE.suffix:
        return 'Suffix';
      case WORD_PART_TYPE.prefix:
        return 'Prefix';
      case WORD_PART_TYPE.vowel:
        return 'Vowel';
      case WORD_PART_TYPE.consonant:
        return 'Consonant';
      default:
        return 'Unknown';
    }
  };

  const getTypeIcon = (type: WORD_PART_TYPE): string => {
    switch (type) {
      case WORD_PART_TYPE.suffix:
        return '🔚';
      case WORD_PART_TYPE.prefix:
        return '🔛';
      case WORD_PART_TYPE.vowel:
        return '🔊';
      case WORD_PART_TYPE.consonant:
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
          {getTypeIcon(wordPart.type)} {getTypeLabel(wordPart.type)}
        </span>
      </div>
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

export default WordPartCard;
