import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import WordPartCard from '../atoms/WordPart/WordPartCard';
import WordPartForm from '../atoms/WordPart/WordPartForm';
import { DefaultWordPart, type WordPart } from '../../model/gamedev';
import { copyContents } from '../../utils/copyToClipboard';
import { checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const WORDPARTS_PER_PAGE = 24;
const wordPartSearchByOptions = [
  { value: 'value', label: 'Value' },
  { value: 'definition', label: 'Definition' }
];
const wordPartSortByOptions: { value: string; label: string }[] = [];

const WordPartPage: React.FC = () => {
  const { data: wordParts = [], isLoading: isLoadingWordParts } = useLoadRecordsByType<WordPart>('word-parts');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('value');
  const [sortBy, setSortBy] = useState<string>('value');

  const [editForm, setEditForm] = useState<WordPart>(DefaultWordPart);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wordPartToDelete, setWordPartToDelete] = useState<WordPart | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWordParts = wordParts.filter((wp: WordPart) => {
    if (searchBy === 'definition') {
      return wp.definition.toLowerCase().includes(search.toLowerCase());
    } else {
      return wp.value.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedWordParts = [...filteredWordParts].sort((a, b) => {
    return a.value.localeCompare(b.value);
  });
  const totalPages = Math.ceil(sortedWordParts.length / WORDPARTS_PER_PAGE);
  const paginatedWordParts = sortedWordParts.slice(
    (currentPage - 1) * WORDPARTS_PER_PAGE,
    currentPage * WORDPARTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, wordParts.length]);

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

  const handleSubmit = async (payload: WordPart[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'word-parts' });
  };

  const handleAddWordPart = (form: WordPart) => {
    const newWordPart = {
      ...form,
      value: form.value.toLocaleLowerCase(),
    };

    const isThereADuplicate = checkIfDuplicateId(wordParts.map(i => i.value), form.value);
    if (!isThereADuplicate) {
      const updatedWordParts = [newWordPart, ...wordParts];
      handleSubmit(updatedWordParts);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultWordPart);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditWordPart = (form: WordPart) => {
    const updatedWordParts = wordParts.map((wp) =>
      wp.value === form.value
        ? {
          ...form,
          value: form.value.toLocaleLowerCase(),
        }
        : wp
    );
    handleSubmit(updatedWordParts);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultWordPart);
  };

  const startEdit = (selectedWordPart: WordPart) => {
    setEditForm(selectedWordPart);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultWordPart);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultWordPart);
  };

  const handleDeleteWordPart = (wordPart: WordPart) => {
    setWordPartToDelete(wordPart);
    setShowDeleteModal(true);
  };

  const confirmDeleteWordPart = () => {
    if (wordPartToDelete) {
      const updatedWordParts = wordParts.filter((wp) => wp.value !== wordPartToDelete.value);
      handleSubmit(updatedWordParts);
      setShowDeleteModal(false);
      setWordPartToDelete(null);
    }
  };

  const cancelDeleteWordPart = () => {
    setShowDeleteModal(false);
    setWordPartToDelete(null);
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
      <Banner {...showBanner} />
      <h1 className="page-title">Word Parts</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={wordPartSearchByOptions}
        sortByOptions={wordPartSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingWordParts ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedWordParts.map((wordPart, idx) => (
              <WordPartCard
                key={idx}
                wordPart={wordPart}
                onEdit={() => {
                  startEdit(wordPart);
                }}
                onDelete={() => handleDeleteWordPart(wordPart)}
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
        onClose={cancelDeleteWordPart}
        title={
          wordPartToDelete ? `Are you sure you want to delete "${wordPartToDelete.value}"?` : 'Error missing word part'
        }
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteWordPart}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteWordPart}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(wordParts))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(wordParts)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(wordParts))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(wordParts)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Word Part'}
      >
        <WordPartForm
          onSubmit={isEditing ? handleEditWordPart : handleAddWordPart}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default WordPartPage;
