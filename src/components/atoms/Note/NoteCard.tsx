import React from 'react';
import type { Note } from '../../../model/library';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{note.name}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Details:</span> <span className="card-text">{note.details}</span>
        </div>
        <div>
          <span className="card-label">Created:</span> <span className="card-text">{note.createdDate}</span>
        </div>
        <div>
          <span className="card-label">Updated:</span> <span className="card-text">{note.updatedDate}</span>
        </div>
        {note.tags.length ? (
          <div className="tags-container">
            <span className="card-label">Tags:</span>
            {note.tags.split(',').filter(Boolean).map((tag, idx) => (
              <button
                key={idx}
                className="tag-btn"
                onClick={() => onHandleClickTag(tag.trim())}
              >
                {tag.trim()}
              </button>
            ))}
          </div>
        ) : null}
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

export default NoteCard; 