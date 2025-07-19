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
import { DefaultName, type Name } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';

const NAMES_PER_PAGE = 24;
const nameSearchByOptions = [
  { value: 'value', label: 'Name' },
  { value: 'origin', label: 'Origin' },
  { value: 'tags', label: 'Tags' },
];
const nameSortByOptions: { value: string; label: string }[] = [];

const ConstructedNamePage: React.FC = () => {
  const { data: names = [], isLoading: isLoadingNames } = useLoadRecordsByType<Name>('constructed-names');
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
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
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

  const handleSubmit = async (payload: Name[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'constructed-names' });
  };

  const handleAddName = (form: Name) => {
    const newName = {
      value: form.value,
      gender: form.gender,
      origin: form.origin,
      tags: form.tags
    };
    const updatedNames = [newName, ...names];
    handleSubmit(updatedNames);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
    setSearch('');
  };

  const handleEditName = (form: Name) => {
    const updatedNames = names.map((n) =>
      n.value === form.value
        ? {
          value: form.value,
          gender: form.gender,
          origin: form.origin,
          tags: form.tags
        }
        : n
    );
    handleSubmit(updatedNames);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultName);
  };

  const startEdit = (selectedName: Name, isClone?: boolean) => {
    setEditForm({
      value: selectedName.value,
      gender: selectedName.gender,
      origin: selectedName.origin,
      tags: selectedName.tags
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
      <Banner isVisible={showBanner.show} type={showBanner.type} />
      <h1 className="page-title">Constructed Names</h1>
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
            Show All Tags
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
        />
      </Sidepanel>
    </div>
  );
};

export default ConstructedNamePage;
