import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrevious: () => void;
  handlePageSelect: (pageIndex: number) => void;
  handleNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePrevious,
  handlePageSelect,
  handleNext
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination-wrapper">
      <button className="primary-btn" onClick={handlePrevious} disabled={currentPage === 1}>
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`primary-btn${currentPage === i + 1 ? ' active' : ''}`}
          onClick={() => handlePageSelect(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button className="primary-btn" onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
