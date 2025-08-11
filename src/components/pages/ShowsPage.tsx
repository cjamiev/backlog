import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import ShowCard from '../atoms/Show/ShowCard';
import ShowForm from '../atoms/Show/ShowForm';
import { DefaultShow, serviceType, type Show } from '../../model/entertainment';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

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
  const { data: shows = [], isLoading: isLoadingShows } = useLoadRecordsByType<Show>('shows');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

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
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

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
      return b.rank - a.rank;
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
    setCurrentPage(1);
  }, [search, searchBy, sortBy, shows.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_ERROR });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isError]);

  const handleSubmit = async (payload: Show[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'shows' });
  };

  const handleAddShow = (form: Show) => {
    const newShow = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(shows.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedShows = [newShow, ...shows];
      handleSubmit(updatedShows);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultShow);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditShow = (form: Show) => {
    const updatedShows = shows.map((s) =>
      s.name === form.name
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : s
    );
    handleSubmit(updatedShows);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultShow);
  };

  const startEdit = (selectedShow: Show, isClone?: boolean) => {
    setEditForm(selectedShow);
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
      const updatedShows = shows.filter((s) => s.name !== showToDelete.name);
      handleSubmit(updatedShows);
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
  const handleOpenTagsModal = () => setShowTagsModal(true);
  const handleCloseTagsModal = () => setShowTagsModal(false);
  const handleSelectTagFromModal = (tag: string) => {
    setSearchBy('tags');
    setSearch(tag);
    setShowTagsModal(false);
  };

  const handlePrevious = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handlePageSelect = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };
  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const toggleTableView = () => {
    setShowTableView(!showTableView);
  }

  return (
    <div className="page-wrapper">
      <Banner {...showBanner} />
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
      {!showTableView ? <div className="page-body-layout">
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
      </div> : <div className='list-wrapper'>
        {serviceType.map(service => (
          <div key={service} className='list-section'>
            <label>{service}</label>
            {sortedShows.filter(show => show.service === service).map(show => <div key={show.name} className='list-item' onClick={() => { startEdit(show); }}>{show.name}</div>)}
          </div>
        ))}
      </div>}
      <Footer>
        <div className='footer-btn-wrapper'>
          <div className='switch-wrapper'>
            <label className="switch">
              <input type="checkbox" onClick={toggleTableView} />
              <span className="slider round"></span>
            </label>
            <label className='switch-label'>{showTableView ? 'Hide Table View' : 'Show Table View'}</label>
          </div>
          <div>
            <button className="primary-btn" onClick={handleOpenCSVModal}>
              Show CSV
            </button>
            <button className="primary-btn" onClick={handleOpenJSONModal}>
              Show JSON
            </button>
            <button className="primary-btn" onClick={handleOpenTagsModal}>
              Select A Tag
            </button>
          </div>
        </div>
        {!showTableView && <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePrevious={handlePrevious}
          handlePageSelect={handlePageSelect}
          handleNext={handleNext}
        />}
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
      <Modal isOpen={showTagsModal} onClose={handleCloseTagsModal} title="All Tags">
        <div className="modal-data-display">
          <div className="tags-container">
            {allTags.length === 0 && <div>No tags available.</div>}
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                className="tag-btn"
                onClick={() => handleSelectTagFromModal(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
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
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default ShowsPage;
