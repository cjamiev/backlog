import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import ShowCard from '../atoms/Show/ShowCard';
import ShowForm from '../atoms/Show/ShowForm';
import { DefaultShow, type Show } from '../../model/library';
import { fakeShows } from '../../mocked/shows';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorage } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const SHOWS_PER_PAGE = 24;
const showSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' }
];
const showSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const ShowsPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingShows, setIsLoadingShows] = useState<boolean>(true);
  const [shows, setShows] = useState<Show[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Show>(DefaultShow);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToDelete, setShowToDelete] = useState<Show | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredShows = shows.filter((s: Show) => {
    if (searchBy === 'tags') {
      return s.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return s.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedShows = [...filteredShows].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.rank - b.rank;
    }
  });
  const totalPages = Math.ceil(sortedShows.length / SHOWS_PER_PAGE);
  const paginatedShows = sortedShows.slice((currentPage - 1) * SHOWS_PER_PAGE, currentPage * SHOWS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      shows.flatMap((show) =>
        show.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (isBackendAvailable && isLoadingShows) {
      loadRecordsByType('shows').then((records: Show[]) => {
        setShows(records);
        setIsLoadingShows(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedShows = getRecordsFromStorage('shows', [...fakeShows]);
      setShows(savedShows);
      setIsLoadingShows(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingShows]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, shows.length]);

  const handleSubmit = async (payload: Show[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('shows', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'shows')
        .then((isSuccess: boolean) => {
          if (isSuccess) {
            setShowBanner({ show: true, type: 'success' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          } else {
            setShowBanner({ show: true, type: 'error' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          }
        })
        .catch((error: unknown) => {
          setShowBanner({ show: true, type: 'error' });
          setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          console.error('Error:', error);
        });
    }
  };

  const handleAddShow = (form: Show) => {
    const newShow = {
      name: form.name,
      rank: form.rank,
      tags: form.tags
    };
    setShows((prev) => {
      const updatedShows = [newShow, ...prev];
      handleSubmit(updatedShows);
      return updatedShows;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultShow);
    setSearch('');
  };

  const handleEditShow = (form: Show) => {
    setShows((prev) => {
      const updatedShows = prev.map((s) =>
        s.name === form.name
          ? {
              name: form.name,
              rank: form.rank,
              tags: form.tags
            }
          : s
      );

      handleSubmit(updatedShows);
      return updatedShows;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultShow);
  };

  const startEdit = (selectedShow: Show, isClone?: boolean) => {
    setEditForm({
      name: selectedShow.name,
      rank: selectedShow.rank,
      tags: selectedShow.tags
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultShow);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultShow);
  };

  const handleDeleteShow = (show: Show) => {
    setShowToDelete(show);
    setShowDeleteModal(true);
  };

  const confirmDeleteShow = () => {
    if (showToDelete) {
      setShows((prev) => {
        const updatedShows = prev.filter((s) => s.name !== showToDelete.name);
        handleSubmit(updatedShows);
        return updatedShows;
      });
      setShowDeleteModal(false);
      setShowToDelete(null);
    }
  };

  const cancelDeleteShow = () => {
    setShowDeleteModal(false);
    setShowToDelete(null);
  };

  const handleClickTag = (tag: string) => {
    setSearchBy('tags');
    setSearch(tag);
  };

  const handleChangeSearchBy = (filter: string) => {
    setSearchBy(filter);
  };

  const handleChangeSortBy = (val: string) => setSortBy(val);

  const handleOpenCSVModal = () => setShowCSVModal(true);
  const handleCloseCSVModal = () => setShowCSVModal(false);
  const handleOpenJSONModal = () => setShowJSONModal(true);
  const handleCloseJSONModal = () => setShowJSONModal(false);

  const handlePrevious = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handlePageSelect = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };
  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} />
      <h1 className="page-title">Shows</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={showSearchByOptions}
        sortByOptions={showSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingShows ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedShows.map((show, idx) => (
              <ShowCard
                key={idx}
                show={show}
                onEdit={() => {
                  startEdit(show);
                }}
                onClone={() => {
                  startEdit(show, true);
                }}
                onDelete={() => handleDeleteShow(show)}
                onHandleClickTag={handleClickTag}
              />
            ))}
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div>
      <Footer>
        <div>
          <button className="primary-btn" onClick={handleOpenCSVModal}>
            Show CSV
          </button>
          <button className="primary-btn" onClick={handleOpenJSONModal}>
            Show JSON
          </button>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePrevious={handlePrevious}
          handlePageSelect={handlePageSelect}
          handleNext={handleNext}
        />
      </Footer>
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDeleteShow}
        title={showToDelete ? `Are you sure you want to delete "${showToDelete.name}"?` : 'Error missing show'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteShow}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteShow}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(shows))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(shows)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(shows))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(shows)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Show'}
      >
        <ShowForm
          onSubmit={isEditing ? handleEditShow : handleAddShow}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default ShowsPage;
