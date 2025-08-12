import React from 'react';
import type { Note } from '../../../model/tracker';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{note.name}</h2>
      </div>
      <div className='card-body card-body__lg'>
        <div>
          <span className="card-label">Created:</span> <span className="card-text">{note.createdDate.slice(4, 16)}</span>
          <span className="card-label">{note.updatedDate ? 'Updated:' : ''}</span> <span className="card-text">{note.updatedDate.slice(4, 16)}</span>
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
        <span className="card-label">Details:</span>
        <pre className='card-details'>
          {note.details}
        </pre>
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

export default NoteCard; 