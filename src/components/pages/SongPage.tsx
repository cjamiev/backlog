import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import SongCard from '../atoms/Song/SongCard';
import SongForm from '../atoms/Song/SongForm';
import { DefaultSong, type Song } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON, getRankStars } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const SONGS_PER_PAGE = 24;
const songSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' },
  { value: 'band', label: 'Band' }
];
const songSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' },
  { value: 'band', label: 'Band' }
];

const SongPage: React.FC = () => {
  const { data: songs = [], isLoading: isLoadingSongs } = useLoadRecordsByType<Song>('songs');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Song>(DefaultSong);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

  const filteredSongs = songs.filter((s: Song) => {
    if (searchBy === 'tags') {
      return s.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else if (searchBy === 'band') {
      return s.band.toLowerCase().includes(search.toLowerCase());
    } else {
      return s.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'band') {
      return a.band.localeCompare(b.band);
    } else {
      return b.rank - a.rank;
    }
  });
  const totalPages = Math.ceil(sortedSongs.length / SONGS_PER_PAGE);
  const paginatedSongs = sortedSongs.slice((currentPage - 1) * SONGS_PER_PAGE, currentPage * SONGS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      songs.flatMap((song) =>
        song.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, songs.length]);

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

  const handleSubmit = async (payload: Song[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'songs' });
  };

  const handleAddSong = (form: Song) => {
    const newSong = {
      ...form,
      id: capitalizeEachWord(form.name) + capitalizeEachWord(form.band),
      name: capitalizeEachWord(form.name),
      album: capitalizeEachWord(form.album),
      band: capitalizeEachWord(form.band),
    };
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setSearch('');

    const isThereADuplicate = checkIfDuplicateId(songs.map(i => i.id), newSong.id);
    if (!isThereADuplicate) {
      const updatedSongs = [newSong, ...songs];
      handleSubmit(updatedSongs);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultSong);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditSong = (form: Song) => {
    const updatedSongs = songs.map((s) =>
      s.id === form.id
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
          album: capitalizeEachWord(form.album),
          band: capitalizeEachWord(form.band),
        }
        : s
    );
    handleSubmit(updatedSongs);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultSong);
  };

  const startEdit = (selectedSong: Song, isClone?: boolean) => {
    setEditForm({
      ...selectedSong,
      id: isClone ? selectedSong.name + selectedSong.band + ' copy' : selectedSong.name + selectedSong.band,
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultSong);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultSong);
  };

  const handleDeleteSong = (song: Song) => {
    setSongToDelete(song);
    setShowDeleteModal(true);
  };

  const confirmDeleteSong = () => {
    if (songToDelete) {
      const updatedSongs = songs.filter((s) => s.id !== songToDelete.id);
      handleSubmit(updatedSongs);
      setShowDeleteModal(false);
      setSongToDelete(null);
    }
  };

  const cancelDeleteSong = () => {
    setShowDeleteModal(false);
    setSongToDelete(null);
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
      <h1 className="page-title">Songs</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={songSearchByOptions}
        sortByOptions={songSortByOptions}
      />
      {!showTableView ? <div className="page-body-layout">
        {!isLoadingSongs ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedSongs.map((song, idx) => (
              <SongCard
                key={idx}
                song={song}
                onEdit={() => {
                  startEdit(song);
                }}
                onClone={() => {
                  startEdit(song, true);
                }}
                onDelete={() => handleDeleteSong(song)}
                onHandleClickTag={handleClickTag}
              />
            ))}
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div> : <div className='list-wrapper'>
        <div className='list-section'>
          <label>{getRankStars(5)}</label>
          {sortedSongs.filter(song => song.rank === 5).map(song => <div key={song.name} className='list-item' onClick={() => { startEdit(song); }}>{song.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(4)}</label>
          {sortedSongs.filter(song => song.rank === 4).map(song => <div key={song.name} className='list-item' onClick={() => { startEdit(song); }}>{song.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(3)}</label>
          {sortedSongs.filter(song => song.rank === 3).map(song => <div key={song.name} className='list-item' onClick={() => { startEdit(song); }}>{song.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(2)}</label>
          {sortedSongs.filter(song => song.rank === 2).map(song => <div key={song.name} className='list-item' onClick={() => { startEdit(song); }}>{song.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(1)}</label>
          {sortedSongs.filter(song => song.rank === 1).map(song => <div key={song.name} className='list-item' onClick={() => { startEdit(song); }}>{song.name}</div>)}
        </div>
      </div>}
      <Footer>
        <div className='footer-btn-wrapper'>
          <div className='switch-wrapper'>
            <label className='switch-label'>{showTableView ? 'Hide Table View' : 'Show Table View'}</label>
            <label className="switch">
              <input type="checkbox" onClick={toggleTableView} />
              <span className="slider round"></span>
            </label>
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
        onClose={cancelDeleteSong}
        title={songToDelete ? `Are you sure you want to delete "${songToDelete.name}"?` : 'Error missing song'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteSong}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteSong}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(songs))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(songs)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(songs))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(songs)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Song'}
      >
        <SongForm
          onSubmit={isEditing ? handleEditSong : handleAddSong}
          initialValues={editForm}
          allTags={allTags}
          cancelEdit={cancelEdit}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default SongPage;
