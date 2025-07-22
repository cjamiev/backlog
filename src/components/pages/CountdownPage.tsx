import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import CountdownCard from '../atoms/Countdown/CountdownCard';
import CountdownForm from '../atoms/Countdown/CountdownForm';
import { DefaultCountdown, type Countdown } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';

const COUNTDOWNS_PER_PAGE = 24;
const countdownSearchByOptions = [{ value: 'name', label: 'Name' },
{ value: 'tags', label: 'Tags' },];
const countdownSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' }
];

const CountdownPage: React.FC = () => {
  const { data: countdowns = [], isLoading: isLoadingCountdowns } = useLoadRecordsByType<Countdown>('countdowns');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Countdown>(DefaultCountdown);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countdownToDelete, setCountdownToDelete] = useState<Countdown | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredCountdowns = countdowns.filter((c: Countdown) => {
    if (searchBy === 'name') {
      return c.name.toLowerCase().includes(search.toLowerCase());
    } else {
      return c.tags.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedCountdowns = [...filteredCountdowns].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
  const totalPages = Math.ceil(sortedCountdowns.length / COUNTDOWNS_PER_PAGE);
  const paginatedCountdowns = sortedCountdowns.slice(
    (currentPage - 1) * COUNTDOWNS_PER_PAGE,
    currentPage * COUNTDOWNS_PER_PAGE
  );

  const allTags = Array.from(
    new Set(
      countdowns.flatMap((countdown) =>
        countdown.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, countdowns.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowBanner({ show: true, type: 'success' });
      setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowBanner({ show: true, type: 'error' });
      setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
    }
  }, [isError]);

  const handleSubmit = async (payload: Countdown[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'countdowns' });
  };

  const handleAddCountdown = (form: Countdown) => {
    const newCountdown = {
      id: String(countdowns.length + 1),
      name: form.name,
      date: form.date,
      tags: form.tags
    };
    const updatedCountdowns = [newCountdown, ...countdowns];
    handleSubmit(updatedCountdowns);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultCountdown);
    setSearch('');
  };

  const handleEditCountdown = (form: Countdown) => {
    const updatedCountdowns = countdowns.map((c) =>
      c.id === form.id
        ? {
          id: c.id,
          name: form.name,
          date: form.date,
          tags: form.tags
        }
        : c
    );
    handleSubmit(updatedCountdowns);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultCountdown);
  };

  const startEdit = (selectedCountdown: Countdown, isClone?: boolean) => {
    setEditForm({
      id: isClone ? String(countdowns.length + 1) : selectedCountdown.id,
      name: selectedCountdown.name,
      date: selectedCountdown.date,
      tags: selectedCountdown.tags
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultCountdown);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultCountdown);
  };

  const handleDeleteCountdown = (countdown: Countdown) => {
    setCountdownToDelete(countdown);
    setShowDeleteModal(true);
  };

  const confirmDeleteCountdown = () => {
    if (countdownToDelete) {
      const updatedCountdowns = countdowns.filter((c) => c.id !== countdownToDelete.id);
      handleSubmit(updatedCountdowns);
      setShowDeleteModal(false);
      setCountdownToDelete(null);
    }
  };

  const cancelDeleteCountdown = () => {
    setShowDeleteModal(false);
    setCountdownToDelete(null);
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

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} />
      <h1 className="page-title">Countdowns</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={countdownSearchByOptions}
        sortByOptions={countdownSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingCountdowns ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedCountdowns.map((countdown, idx) => (
              <CountdownCard
                key={idx}
                countdown={countdown}
                onEdit={() => {
                  startEdit(countdown);
                }}
                onClone={() => {
                  startEdit(countdown, true);
                }}
                onDelete={() => handleDeleteCountdown(countdown)}
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
          <button className="primary-btn" onClick={handleOpenTagsModal}>
            Select A Tag
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
        onClose={cancelDeleteCountdown}
        title={
          countdownToDelete ? `Are you sure you want to delete "${countdownToDelete.name}"?` : 'Error missing countdown'
        }
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteCountdown}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteCountdown}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(countdowns))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(countdowns)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(countdowns))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(countdowns)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Countdown'}
      >
        <CountdownForm
          onSubmit={isEditing ? handleEditCountdown : handleAddCountdown}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default CountdownPage;
