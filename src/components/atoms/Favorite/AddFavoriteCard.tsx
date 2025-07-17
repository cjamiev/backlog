import React from 'react';

interface AddFavoriteCardProps {
  onClick: () => void;
}

const AddFavoriteCard: React.FC<AddFavoriteCardProps> = ({ onClick }) => {
  return (
    <div className="card-add-new-favorite-wrapper" onClick={onClick}>
      <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="23" stroke="#1E3A8A" strokeWidth="2" fill="#e0e7ff" />
        <rect x="22" y="12" width="4" height="24" rx="2" fill="#1E3A8A" />
        <rect x="12" y="22" width="24" height="4" rx="2" fill="#1E3A8A" />
      </svg>
      <div className="card-add-favorite-label">Add New Favorite</div>
    </div>
  );
};

export default AddFavoriteCard;
