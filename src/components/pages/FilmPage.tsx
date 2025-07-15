import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import FilmCard from '../atoms/Film/FilmCard';
import FilmForm from '../atoms/Film/FilmForm';
import { DefaultFilm, type Film } from '../../model/library';
import { fakeFilms } from '../../mocked/films';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorageContext } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const FILMS_PER_PAGE = 24;
const filmSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' }
];
const filmSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const FilmPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorageContext();
  const [isLoadingFilms, setIsLoadingFilms] = useState<boolean>(true);
  const [films, setFilms] = useState<Film[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Film>(DefaultFilm);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filmToDelete, setFilmToDelete] = useState<Film | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFilms = films.filter((f: Film) => {
    if (searchBy === 'tags') {
      return f.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return f.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedFilms = [...filteredFilms].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.rank - b.rank;
    }
  });
  const totalPages = Math.ceil(sortedFilms.length / FILMS_PER_PAGE);
  const paginatedFilms = sortedFilms.slice((currentPage - 1) * FILMS_PER_PAGE, currentPage * FILMS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      films.flatMap((film) =>
        film.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (isBackendAvailable && isLoadingFilms) {
      loadRecordsByType('films').then((records: Film[]) => {
        setFilms(records);
        setIsLoadingFilms(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedFilms = getRecordsFromStorage('films', [...fakeFilms]);
      setFilms(savedFilms);
      setIsLoadingFilms(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingFilms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, films.length]);

  const handleSubmit = async (payload: Film[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('films', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'films')
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

  const handleAddFilm = (form: Film) => {
    const newFilm = {
      name: form.name,
      rank: form.rank,
      tags: form.tags
    };
    setFilms((prev) => {
      const updatedFilms = [newFilm, ...prev];
      handleSubmit(updatedFilms);
      return updatedFilms;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFilm);
    setSearch('');
  };

  const handleEditFilm = (form: Film) => {
    setFilms((prev) => {
      const updatedFilms = prev.map((f) =>
        f.name === form.name
          ? {
            name: form.name,
            rank: form.rank,
            tags: form.tags
          }
          : f
      );

      handleSubmit(updatedFilms);
      return updatedFilms;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFilm);
  };

  const startEdit = (selectedFilm: Film, isClone?: boolean) => {
    setEditForm({
      name: selectedFilm.name,
      rank: selectedFilm.rank,
      tags: selectedFilm.tags
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultFilm);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFilm);
  };

  const handleDeleteFilm = (film: Film) => {
    setFilmToDelete(film);
    setShowDeleteModal(true);
  };

  const confirmDeleteFilm = () => {
    if (filmToDelete) {
      setFilms((prev) => {
        const updatedFilms = prev.filter((f) => f.name !== filmToDelete.name);
        handleSubmit(updatedFilms);
        return updatedFilms;
      });
      setShowDeleteModal(false);
      setFilmToDelete(null);
    }
  };

  const cancelDeleteFilm = () => {
    setShowDeleteModal(false);
    setFilmToDelete(null);
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
      <h1 className="page-title">Films</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={filmSearchByOptions}
        sortByOptions={filmSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingFilms ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedFilms.map((film, idx) => (
              <FilmCard
                key={idx}
                film={film}
                onEdit={() => {
                  startEdit(film);
                }}
                onClone={() => {
                  startEdit(film, true);
                }}
                onDelete={() => handleDeleteFilm(film)}
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
        onClose={cancelDeleteFilm}
        title={filmToDelete ? `Are you sure you want to delete "${filmToDelete.name}"?` : 'Error missing film'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteFilm}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteFilm}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(films))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(films)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(films))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(films)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Film'}
      >
        <FilmForm
          onSubmit={isEditing ? handleEditFilm : handleAddFilm}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default FilmPage;
