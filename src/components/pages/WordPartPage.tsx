import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import WordPartCard from '../atoms/WordPart/WordPartCard';
import WordPartForm from '../atoms/WordPart/WordPartForm';
import { DefaultWordPart, type WordPart } from '../../model/library';
import { fakeWordParts } from '../../mocked/wordParts';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorageContext } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const WORDPARTS_PER_PAGE = 24;
const wordPartSearchByOptions = [
  { value: 'value', label: 'Value' },
  { value: 'definition', label: 'Definition' }
];
const wordPartSortByOptions: { value: string; label: string }[] = [];

const WordPartPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorageContext();
  const [isLoadingWordParts, setIsLoadingWordParts] = useState<boolean>(true);
  const [wordParts, setWordParts] = useState<WordPart[]>([]);

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
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
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
    if (isBackendAvailable && isLoadingWordParts) {
      loadRecordsByType('word-parts').then((records: WordPart[]) => {
        setWordParts(records);
        setIsLoadingWordParts(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedWordParts = getRecordsFromStorage('word-parts', [...fakeWordParts]);
      setWordParts(savedWordParts);
      setIsLoadingWordParts(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingWordParts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, wordParts.length]);

  const handleSubmit = async (payload: WordPart[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('word-parts', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'word-parts')
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

  const handleAddWordPart = (form: WordPart) => {
    const newWordPart = {
      value: form.value,
      definition: form.definition,
      type: form.type
    };
    setWordParts((prev) => {
      const updatedWordParts = [newWordPart, ...prev];
      handleSubmit(updatedWordParts);
      return updatedWordParts;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultWordPart);
    setSearch('');
  };

  const handleEditWordPart = (form: WordPart) => {
    setWordParts((prev) => {
      const updatedWordParts = prev.map((wp) =>
        wp.value === form.value
          ? {
            value: form.value,
            definition: form.definition,
            type: form.type
          }
          : wp
      );

      handleSubmit(updatedWordParts);
      return updatedWordParts;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultWordPart);
  };

  const startEdit = (selectedWordPart: WordPart, isClone?: boolean) => {
    setEditForm({
      value: selectedWordPart.value,
      definition: selectedWordPart.definition,
      type: selectedWordPart.type
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
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
      setWordParts((prev) => {
        const updatedWordParts = prev.filter((wp) => wp.value !== wordPartToDelete.value);
        handleSubmit(updatedWordParts);
        return updatedWordParts;
      });
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
      <Banner isVisible={showBanner.show} type={showBanner.type} />
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
                onClone={() => {
                  startEdit(wordPart, true);
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
          isEditing={isEditing}
          cancelEdit={cancelEdit}
        />
      </Sidepanel>
    </div>
  );
};

export default WordPartPage;
