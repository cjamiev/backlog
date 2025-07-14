import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import FavoriteCard from '../atoms/Favorite/FavoriteCard';
import FavoriteForm from '../atoms/Favorite/FavoriteForm';
import { DefaultFavorite, type Favorite } from '../../model/library';
import { fakeFavorites } from '../../mocked/favorites';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorage } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const FAVORITES_PER_PAGE = 24;
const favoriteSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' },
  { value: 'notes', label: 'Notes' }
];
const favoriteSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' }
];

const FavoritePage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingFavorites, setIsLoadingFavorites] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Favorite>(DefaultFavorite);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState<Favorite | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFavorites = favorites.filter((f: Favorite) => {
    if (searchBy === 'tags') {
      return f.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else if (searchBy === 'notes') {
      return f.notes.toLowerCase().includes(search.toLowerCase());
    } else {
      return f.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.type - b.type;
    }
  });
  const totalPages = Math.ceil(sortedFavorites.length / FAVORITES_PER_PAGE);
  const paginatedFavorites = sortedFavorites.slice(
    (currentPage - 1) * FAVORITES_PER_PAGE,
    currentPage * FAVORITES_PER_PAGE
  );

  const allTags = Array.from(
    new Set(
      favorites.flatMap((favorite) =>
        favorite.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (isBackendAvailable && isLoadingFavorites) {
      loadRecordsByType('favorites').then((records: Favorite[]) => {
        setFavorites(records);
        setIsLoadingFavorites(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedFavorites = getRecordsFromStorage('favorites', [...fakeFavorites]);
      setFavorites(savedFavorites);
      setIsLoadingFavorites(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingFavorites]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, favorites.length]);

  const handleSubmit = async (payload: Favorite[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('favorites', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'favorites')
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

  const handleAddFavorite = (form: Favorite) => {
    const newFavorite = {
      name: form.name,
      link: form.link,
      type: form.type,
      tags: form.tags,
      notes: form.notes
    };
    setFavorites((prev) => {
      const updatedFavorites = [newFavorite, ...prev];
      handleSubmit(updatedFavorites);
      return updatedFavorites;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFavorite);
    setSearch('');
  };

  const handleEditFavorite = (form: Favorite) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.map((f) =>
        f.name === form.name && f.link === form.link
          ? {
              name: form.name,
              link: form.link,
              type: form.type,
              tags: form.tags,
              notes: form.notes
            }
          : f
      );

      handleSubmit(updatedFavorites);
      return updatedFavorites;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFavorite);
  };

  const startEdit = (selectedFavorite: Favorite, isClone?: boolean) => {
    setEditForm({
      name: selectedFavorite.name,
      link: selectedFavorite.link,
      type: selectedFavorite.type,
      tags: selectedFavorite.tags,
      notes: selectedFavorite.notes
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultFavorite);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFavorite);
  };

  const handleDeleteFavorite = (favorite: Favorite) => {
    setFavoriteToDelete(favorite);
    setShowDeleteModal(true);
  };

  const confirmDeleteFavorite = () => {
    if (favoriteToDelete) {
      setFavorites((prev) => {
        const updatedFavorites = prev.filter(
          (f) => !(f.name === favoriteToDelete.name && f.link === favoriteToDelete.link)
        );
        handleSubmit(updatedFavorites);
        return updatedFavorites;
      });
      setShowDeleteModal(false);
      setFavoriteToDelete(null);
    }
  };

  const cancelDeleteFavorite = () => {
    setShowDeleteModal(false);
    setFavoriteToDelete(null);
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
      <h1 className="page-title">Favorites</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={favoriteSearchByOptions}
        sortByOptions={favoriteSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingFavorites ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedFavorites.map((favorite, idx) => (
              <FavoriteCard
                key={idx}
                favorite={favorite}
                onEdit={() => {
                  startEdit(favorite);
                }}
                onClone={() => {
                  startEdit(favorite, true);
                }}
                onDelete={() => handleDeleteFavorite(favorite)}
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
        onClose={cancelDeleteFavorite}
        title={
          favoriteToDelete ? `Are you sure you want to delete "${favoriteToDelete.name}"?` : 'Error missing favorite'
        }
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteFavorite}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteFavorite}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(favorites))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(favorites)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(favorites))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(favorites)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Favorite'}
      >
        <FavoriteForm
          onSubmit={isEditing ? handleEditFavorite : handleAddFavorite}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default FavoritePage;
