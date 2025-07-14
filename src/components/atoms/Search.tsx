import React from 'react';

interface SearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchBy: string;
  handleChangeSearchBy: (filter: string) => void;
  sortBy: string;
  handleChangeSortBy: (val: string) => void;
  searchByOptions: { label: string; value: string }[];
  sortByOptions: { label: string; value: string }[];
}

const Search: React.FC<SearchProps> = ({
  search,
  onSearchChange,
  searchBy,
  handleChangeSearchBy,
  sortBy,
  handleChangeSortBy,
  searchByOptions,
  sortByOptions
}) => {
  return (
    <div className="search-section">
      <div className="search-container">
        <input
          className="search-bar"
          type="text"
          placeholder={`Search by ${searchBy}...`}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <label className="search-label">
          Search by:
          <select className="search-select" value={searchBy} onChange={(e) => handleChangeSearchBy(e.target.value)}>
            {searchByOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {sortByOptions.length > 0 ? (
        <div className="search-controls">
          <label className="search-label-sort">
            Sort by:
            <select className="search-select-sort" value={sortBy} onChange={(e) => handleChangeSortBy(e.target.value)}>
              {sortByOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
