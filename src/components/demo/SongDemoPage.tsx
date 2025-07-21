import React, { useState, useEffect } from 'react';
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
import { getCSV, getJSON } from '../../utils/contentMapper';
import { getRecordsFromStorage } from '../../utils/storage';
import { fakeSongs } from '../../mocked/songs';

const SONGS_PER_PAGE = 10;
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

const SongDemoPage: React.FC = () => {
  const [isLoadingSongs, setIsLoadingSongs] = useState<boolean>(true);
  const [songs, setSongs] = useState<Song[]>([]);

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
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

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
    if (isLoadingSongs) {
      const savedShows = getRecordsFromStorage('songs', [...fakeSongs]);
      setSongs(savedShows);
      setIsLoadingSongs(false);
    }
  }, [isLoadingSongs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, songs.length]);

  const handleSubmit = async (payload: Song[]) => {
    localStorage.setItem('songs', JSON.stringify(payload));
    setShowBanner({ show: true, type: 'success' });
    setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
  };

  const handleAddSong = (form: Song) => {
    const newSong = {
      id: String(songs.length + 1),
      name: form.name,
      album: form.album,
      band: form.band,
      rank: form.rank,
      link: form.link,
      tags: form.tags
    };
    setSongs((prev) => {
      const updatedSongs = [newSong, ...prev];
      handleSubmit(updatedSongs);
      return updatedSongs;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultSong);
    setSearch('');
  };

  const handleEditSong = (form: Song) => {
    setSongs((prev) => {
      const updatedSongs = prev.map((s) =>
        s.id === form.id
          ? {
            id: s.id,
            name: form.name,
            album: form.album,
            band: form.band,
            rank: form.rank,
            link: form.link,
            tags: form.tags
          }
          : s
      );

      handleSubmit(updatedSongs);
      return updatedSongs;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultSong);
  };

  const startEdit = (selectedSong: Song, isClone?: boolean) => {
    setEditForm({
      id: isClone ? String(songs.length + 1) : selectedSong.id,
      name: selectedSong.name,
      album: selectedSong.album,
      band: selectedSong.band,
      rank: selectedSong.rank,
      link: selectedSong.link,
      tags: selectedSong.tags
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
      setSongs((prev) => {
        const updatedSongs = prev.filter((s) => s.id !== songToDelete.id);
        handleSubmit(updatedSongs);
        return updatedSongs;
      });
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

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} />
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
      <div className="page-body-layout">
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
        />
      </Sidepanel>
    </div>
  );
};

export default SongDemoPage;
