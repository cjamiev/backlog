import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import IntervalCard from '../atoms/Interval/IntervalCard';
import IntervalForm from '../atoms/Interval/IntervalForm';
import { DefaultInterval, type Interval } from '../../model/gamedev';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const WORDS_PER_PAGE = 24;
const intervalSearchByOptions = [
  { value: 'name', label: 'name' },
  { value: 'origin', label: 'origin' },
  { value: 'tags', label: 'Tags' }
];
const intervalSortByOptions: { value: string; label: string }[] = [];

const IntervalPage: React.FC = () => {
  const { data: intervals = [], isLoading: isLoadingIntervals } = useLoadRecordsByType<Interval>('intervals');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('value');
  const [sortBy, setSortBy] = useState<string>('value');

  const [editForm, setEditForm] = useState<Interval>(DefaultInterval);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [intervalToDelete, setIntervalToDelete] = useState<Interval | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredIntervals = intervals.filter((i: Interval) => {
    if (searchBy === 'tags') {
      return i.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else if (searchBy === 'origin') {
      return i.origin.toLowerCase().includes(search.toLowerCase());
    } else {
      return i.tags.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedIntervals = [...filteredIntervals].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  const totalPages = Math.ceil(sortedIntervals.length / WORDS_PER_PAGE);
  const paginatedIntervals = sortedIntervals.slice((currentPage - 1) * WORDS_PER_PAGE, currentPage * WORDS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      intervals.flatMap((interval) =>
        interval.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, intervals.length]);

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

  const handleSubmit = async (payload: Interval[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'intervals' })
  };

  const handleAddInterval = (form: Interval) => {
    const newInterval = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(intervals.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedIntervals = [newInterval, ...intervals];
      handleSubmit(updatedIntervals);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultInterval);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditInterval = (form: Interval) => {
    const updatedIntervals = intervals.map((i) =>
      i.name === form.name
        ? form : i
    );

    mutate({ payload: JSON.stringify(updatedIntervals), type: 'intervals' });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultInterval);
  };

  const startEdit = (selectedInterval: Interval, isClone?: boolean) => {
    setEditForm(selectedInterval);
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultInterval);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultInterval);
  };

  const handleDeleteInterval = (interval: Interval) => {
    setIntervalToDelete(interval);
    setShowDeleteModal(true);
  };

  const confirmDeleteInterval = () => {
    if (intervalToDelete) {
      const updatedIntervals = intervals.filter((i) => i.name !== intervalToDelete.name);

      mutate({ payload: JSON.stringify(updatedIntervals), type: 'intervals' });
      setShowDeleteModal(false);
      setIntervalToDelete(null);
    }
  };

  const cancelDeleteInterval = () => {
    setShowDeleteModal(false);
    setIntervalToDelete(null);
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
      <Banner {...showBanner} />
      <h1 className="page-title">Intervals</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={intervalSearchByOptions}
        sortByOptions={intervalSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingIntervals ? (
          <div className="cards-container">
            {paginatedIntervals.map((interval, idx) => (
              <IntervalCard
                key={idx}
                interval={interval}
                onEdit={() => {
                  startEdit(interval);
                }}
                onClone={() => {
                  startEdit(interval, true);
                }}
                onDelete={() => handleDeleteInterval(interval)}
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

          <button className="primary-btn" onClick={startAdd}>
            Add Interval
          </button>
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
        onClose={cancelDeleteInterval}
        title={intervalToDelete ? `Are you sure you want to delete "${intervalToDelete.name}"?` : 'Error missing interval'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteInterval}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteInterval}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(intervals))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(intervals)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(intervals))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(intervals)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Interval'}
      >
        <IntervalForm
          onSubmit={isEditing ? handleEditInterval : handleAddInterval}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default IntervalPage;
