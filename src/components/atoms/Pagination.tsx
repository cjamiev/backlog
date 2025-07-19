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

  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-wrapper">
      <button className="primary-btn" onClick={handlePrevious} disabled={currentPage === 1}>
        Prev
      </button>
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          className={`primary-btn${currentPage === pageNum ? ' active' : ''}`}
          onClick={() => handlePageSelect(pageNum)}
        >
          {pageNum}
        </button>
      ))}
      <button className="primary-btn" onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
