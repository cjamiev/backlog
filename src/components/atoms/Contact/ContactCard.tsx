import React from 'react';
import type { Contact } from '../../../model/tracker';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{contact.name}</h2>
      </div>
      <div className='card-body card-body__sm'>
        <div>
          <span className="card-label">Phone:</span> <span className="card-text">{contact.phone}</span>
        </div>
        <div>
          <span className="card-label">Email:</span> <span className="card-text">{contact.email}</span>
        </div>
        <div>
          <span className="card-label">Address:</span> <span className="card-text">{contact.address}</span>
        </div>
        {contact.tags.length ? (
          <div className="tags-container">
            <span className="card-label">Tags:</span>
            {contact.tags.split(',').filter(Boolean).map((tag, idx) => (
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

export default ContactCard; 