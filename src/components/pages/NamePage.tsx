import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import NameCard from '../atoms/Name/NameCard';
import NameForm from '../atoms/Name/NameForm';
import { DefaultName, type Name } from '../../model/library';
import { fakeNames } from '../../mocked/names';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorageContext } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const NAMES_PER_PAGE = 24;
const nameSearchByOptions = [
  { value: 'value', label: 'Name' },
  { value: 'origin', label: 'Origin' }
];
const nameSortByOptions: { value: string; label: string }[] = [];

const NamePage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorageContext();
  const [isLoadingNames, setIsLoadingNames] = useState<boolean>(true);
  const [names, setNames] = useState<Name[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('value');
  const [sortBy, setSortBy] = useState<string>('value');

  const [editForm, setEditForm] = useState<Name>(DefaultName);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nameToDelete, setNameToDelete] = useState<Name | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNames = names.filter((n: Name) => {
    if (searchBy === 'origin') {
      return n.origin.toLowerCase().includes(search.toLowerCase());
    } else {
      return n.value.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedNames = [...filteredNames].sort((a, b) => {
    return a.value.localeCompare(b.value);
  });
  const totalPages = Math.ceil(sortedNames.length / NAMES_PER_PAGE);
  const paginatedNames = sortedNames.slice((currentPage - 1) * NAMES_PER_PAGE, currentPage * NAMES_PER_PAGE);

  useEffect(() => {
    if (isBackendAvailable && isLoadingNames) {
      loadRecordsByType('names').then((records: Name[]) => {
        setNames(records);
        setIsLoadingNames(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedNames = getRecordsFromStorage('names', [...fakeNames]);
      setNames(savedNames);
      setIsLoadingNames(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingNames]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, names.length]);

  const handleSubmit = async (payload: Name[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('names', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'names')
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

  const handleAddName = (form: Name) => {
    const newName = {
      value: form.value,
      gender: form.gender,
      origin: form.origin
    };
    setNames((prev) => {
      const updatedNames = [newName, ...prev];
      handleSubmit(updatedNames);
      return updatedNames;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
    setSearch('');
  };

  const handleEditName = (form: Name) => {
    setNames((prev) => {
      const updatedNames = prev.map((n) =>
        n.value === form.value
          ? {
            value: form.value,
            gender: form.gender,
            origin: form.origin
          }
          : n
      );

      handleSubmit(updatedNames);
      return updatedNames;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
  };

  const startEdit = (selectedName: Name, isClone?: boolean) => {
    setEditForm({
      value: selectedName.value,
      gender: selectedName.gender,
      origin: selectedName.origin
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultName);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
  };

  const handleDeleteName = (name: Name) => {
    setNameToDelete(name);
    setShowDeleteModal(true);
  };

  const confirmDeleteName = () => {
    if (nameToDelete) {
      setNames((prev) => {
        const updatedNames = prev.filter((n) => n.value !== nameToDelete.value);
        handleSubmit(updatedNames);
        return updatedNames;
      });
      setShowDeleteModal(false);
      setNameToDelete(null);
    }
  };

  const cancelDeleteName = () => {
    setShowDeleteModal(false);
    setNameToDelete(null);
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
      <h1 className="page-title">Names</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={nameSearchByOptions}
        sortByOptions={nameSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingNames ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedNames.map((name, idx) => (
              <NameCard
                key={idx}
                name={name}
                onEdit={() => {
                  startEdit(name);
                }}
                onClone={() => {
                  startEdit(name, true);
                }}
                onDelete={() => handleDeleteName(name)}
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
        onClose={cancelDeleteName}
        title={nameToDelete ? `Are you sure you want to delete "${nameToDelete.value}"?` : 'Error missing name'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteName}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteName}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(names))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(names)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(names))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(names)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Name'}
      >
        <NameForm
          onSubmit={isEditing ? handleEditName : handleAddName}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
        />
      </Sidepanel>
    </div>
  );
};

export default NamePage;
