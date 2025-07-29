import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import { DefaultNote, type Note } from '../../model/library';
import NoteCard from '../atoms/Note/NoteCard';
import NoteForm from '../atoms/Note/NoteForm';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const NOTES_PER_PAGE = 24;
const noteSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'details', label: 'Details' },
  { value: 'tags', label: 'Tags' },
];
const noteSortByOptions: { value: string; label: string }[] = [];

const NotePage: React.FC = () => {
  const { data: notes = [], isLoading: isLoadingNotes } = useLoadRecordsByType<Note>('notes');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Note>(DefaultNote);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredNotes = notes.filter((n: Note) => {
    if (searchBy === 'details') {
      return n.details.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return n.tags.toLowerCase().includes(search.toLowerCase());
    } else {
      return n.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => a.name.localeCompare(b.name));
  const totalPages = Math.ceil(sortedNotes.length / NOTES_PER_PAGE);
  const paginatedNotes = sortedNotes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);

  const allTags = Array.from(
    new Set(
      notes.flatMap((note) =>
        note.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, notes.length]);

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

  const handleSubmit = async (payload: Note[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'notes' });
  };

  const handleAddNote = (form: Note) => {
    const newNote = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(notes.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedNotes = [newNote, ...notes];
      handleSubmit(updatedNotes);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultNote);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditNote = (form: Note) => {
    const updatedNotes = notes.map((n) =>
      n.name === form.name
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : n
    );
    handleSubmit(updatedNotes);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultNote);
  };

  const startEdit = (selectedNote: Note, isClone?: boolean) => {
    setEditForm(selectedNote);
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultNote);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultNote);
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((n) => n.name !== noteToDelete.name);
      handleSubmit(updatedNotes);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
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
      <h1 className="page-title">Notes</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={noteSearchByOptions}
        sortByOptions={noteSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingNotes ? (
          <div className="cards-container">
            {paginatedNotes.map((note, idx) => (
              <NoteCard
                key={idx}
                note={note}
                onEdit={() => {
                  startEdit(note);
                }}
                onClone={() => {
                  startEdit(note, true);
                }}
                onDelete={() => handleDeleteNote(note)}
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
          <button className='primary-btn' onClick={startAdd}>Add Note</button>
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
        onClose={cancelDeleteNote}
        title={noteToDelete ? `Are you sure you want to delete "${noteToDelete.name}"?` : 'Error missing note'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteNote}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteNote}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(notes))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(notes)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(notes))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(notes)}</pre>
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
        isWide
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Note'}
      >
        <NoteForm
          onSubmit={isEditing ? handleEditNote : handleAddNote}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default NotePage; 