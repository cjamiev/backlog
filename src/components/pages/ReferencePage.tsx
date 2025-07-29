import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import ReferenceCard from '../atoms/Reference/ReferenceCard';
import ReferenceForm from '../atoms/Reference/ReferenceForm';
import { DefaultReference, type Reference } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const REFERENCES_PER_PAGE = 24;
const referenceSearchByOptions = [
  { value: 'value', label: 'Reference' },
  { value: 'origin', label: 'Origin' },
  { value: 'definition', label: 'Definition' },
  { value: 'tags', label: 'Tags' }
];
const referenceSortByOptions: { value: string; label: string }[] = [];

const ReferencePage: React.FC = () => {
  const { data: references = [], isLoading: isLoadingReferences } = useLoadRecordsByType<Reference>('references');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('value');
  const [sortBy, setSortBy] = useState<string>('value');

  const [editForm, setEditForm] = useState<Reference>(DefaultReference);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<Reference | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredReferences = references.filter((r: Reference) => {
    if (searchBy === 'origin') {
      return r.origin.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'definition') {
      return r.definition.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return r.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return r.value.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedReferences = [...filteredReferences].sort((a, b) => {
    return a.value.localeCompare(b.value);
  });
  const totalPages = Math.ceil(sortedReferences.length / REFERENCES_PER_PAGE);
  const paginatedReferences = sortedReferences.slice(
    (currentPage - 1) * REFERENCES_PER_PAGE,
    currentPage * REFERENCES_PER_PAGE
  );

  const allTags = Array.from(
    new Set(
      references.flatMap((reference) =>
        reference.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, references.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isError]);

  const handleSubmit = async (payload: Reference[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'references' });
  };

  const handleAddReference = (form: Reference) => {
    const newReference = {
      ...form,
      id: String(references.length + 1),
    };

    const isThereADuplicate = checkIfDuplicateId(references.map(i => i.value), form.value);
    if (!isThereADuplicate) {
      const updatedReferences = [newReference, ...references];
      handleSubmit(updatedReferences);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultReference);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditReference = (form: Reference) => {
    const updatedReferences = references.map((r) =>
      r.id === form.id
        ? form
        : r
    );
    handleSubmit(updatedReferences);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultReference);
  };

  const startEdit = (selectedReference: Reference, isClone?: boolean) => {
    setEditForm({
      ...selectedReference,
      id: isClone ? String(references.length + 1) : selectedReference.id,
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultReference);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultReference);
  };

  const handleDeleteReference = (reference: Reference) => {
    setReferenceToDelete(reference);
    setShowDeleteModal(true);
  };

  const confirmDeleteReference = () => {
    if (referenceToDelete) {
      const updatedReferences = references.filter((r) => r.id !== referenceToDelete.id);
      handleSubmit(updatedReferences);
      setShowDeleteModal(false);
      setReferenceToDelete(null);
    }
  };

  const cancelDeleteReference = () => {
    setShowDeleteModal(false);
    setReferenceToDelete(null);
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
      <h1 className="page-title">References</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={referenceSearchByOptions}
        sortByOptions={referenceSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingReferences ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedReferences.map((reference, idx) => (
              <ReferenceCard
                key={idx}
                reference={reference}
                onEdit={() => {
                  startEdit(reference);
                }}
                onClone={() => {
                  startEdit(reference, true);
                }}
                onDelete={() => handleDeleteReference(reference)}
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
        onClose={cancelDeleteReference}
        title={
          referenceToDelete
            ? `Are you sure you want to delete "${referenceToDelete.value}"?`
            : 'Error missing reference'
        }
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteReference}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteReference}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(references))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(references)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(references))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(references)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Reference'}
      >
        <ReferenceForm
          onSubmit={isEditing ? handleEditReference : handleAddReference}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default ReferencePage;
