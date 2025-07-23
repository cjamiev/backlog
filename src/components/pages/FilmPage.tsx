import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import FilmCard from '../atoms/Film/FilmCard';
import FilmForm from '../atoms/Film/FilmForm';
import { DefaultFilm, serviceType, type Film } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';

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
  const { data: films = [], isLoading: isLoadingFilms } = useLoadRecordsByType<Film>('films');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

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
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

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
      return b.rank - a.rank;
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
    setCurrentPage(1);
  }, [search, searchBy, sortBy, films.length]);

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

  const handleSubmit = async (payload: Film[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'films' });
  };

  const handleAddFilm = (form: Film) => {
    const newFilm = {
      name: form.name,
      service: form.service,
      rank: form.rank,
      tags: form.tags
    };
    const updatedFilms = [newFilm, ...films];
    handleSubmit(updatedFilms);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFilm);
    setSearch('');
  };

  const handleEditFilm = (form: Film) => {
    const updatedFilms = films.map((f) =>
      f.name === form.name
        ? {
          name: form.name,
          service: form.service,
          rank: form.rank,
          tags: form.tags
        }
        : f
    );
    handleSubmit(updatedFilms);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFilm);
  };

  const startEdit = (selectedFilm: Film, isClone?: boolean) => {
    setEditForm({
      name: selectedFilm.name,
      service: selectedFilm.service,
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
      const updatedFilms = films.filter((f) => f.name !== filmToDelete.name);
      handleSubmit(updatedFilms);
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
      {!showTableView ? <div className="page-body-layout">
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
      </div> : <div className='list-wrapper'>
        {serviceType.map(service => (
          <div key={service} className='list-section'>
            <label>{service}</label>
            {sortedFilms.filter(film => film.service === service).map(film => <div key={film.name} className='list-item' onClick={() => { startEdit(film); }}>{film.name}</div>)}
          </div>
        ))}
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
        title={isEditing ? 'Updating existing' : 'Add a New Film'}
      >
        <FilmForm
          onSubmit={isEditing ? handleEditFilm : handleAddFilm}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default FilmPage;
