import React from 'react';

interface AddCardProps {
  onClick: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClick }) => {
  return (
    <div className="card-wrapper card-add-new" onClick={onClick}>
      <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="23" stroke="#1E3A8A" strokeWidth="2" fill="#e0e7ff" />
        <rect x="22" y="12" width="4" height="24" rx="2" fill="#1E3A8A" />
        <rect x="12" y="22" width="24" height="4" rx="2" fill="#1E3A8A" />
      </svg>
      <div className="card-add-new-label">Add</div>
    </div>
  );
};

export default AddCard;
