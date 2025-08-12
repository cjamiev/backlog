import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import NameCard from '../atoms/Name/NameCard';
import NameForm from '../atoms/Name/NameForm';
import { DefaultName, type Name } from '../../model/gamedev';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const NAMES_PER_PAGE = 24;
const nameSearchByOptions = [
  { value: 'value', label: 'Name' },
  { value: 'origin', label: 'Origin' },
  { value: 'tags', label: 'Tags' },
];
const nameSortByOptions: { value: string; label: string }[] = [];

const NamePage: React.FC = () => {
  const { data: names = [], isLoading: isLoadingNames } = useLoadRecordsByType<Name>('names');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

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
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredNames = names.filter((n: Name) => {
    if (searchBy === 'origin') {
      return n.origin.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return n.tags.toLowerCase().includes(search.toLowerCase());
    } else {
      return n.value.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedNames = [...filteredNames].sort((a, b) => {
    return a.value.localeCompare(b.value);
  });
  const totalPages = Math.ceil(sortedNames.length / NAMES_PER_PAGE);
  const paginatedNames = sortedNames.slice((currentPage - 1) * NAMES_PER_PAGE, currentPage * NAMES_PER_PAGE);

  const allTags = Array.from(
    new Set(
      names.flatMap((name) =>
        name.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, names.length]);

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

  const handleSubmit = async (payload: Name[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'names' });
  };

  const handleAddName = (form: Name) => {
    const newName = {
      ...form,
      name: capitalizeEachWord(form.value),
    };

    const isThereADuplicate = checkIfDuplicateId(names.map(i => i.value), form.value);
    if (!isThereADuplicate) {
      const updatedNames = [newName, ...names];
      handleSubmit(updatedNames);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultName);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditName = (form: Name) => {
    const updatedNames = names.map((n) =>
      n.value === form.value
        ? {
          ...form,
          name: capitalizeEachWord(form.value),
        }
        : n
    );
    handleSubmit(updatedNames);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
  };

  const startEdit = (selectedName: Name) => {
    setEditForm(selectedName);
    setIsEditing(true);
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
      const updatedNames = names.filter((n) => n.value !== nameToDelete.value);
      handleSubmit(updatedNames);
      setShowDeleteModal(false);
      setNameToDelete(null);
    }
  };

  const cancelDeleteName = () => {
    setShowDeleteModal(false);
    setNameToDelete(null);
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
                onDelete={() => handleDeleteName(name)}
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
        title={isEditing ? 'Updating existing' : 'Add a New Name'}
      >
        <NameForm
          onSubmit={isEditing ? handleEditName : handleAddName}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default NamePage;
