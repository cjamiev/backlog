import React, { useState, useEffect } from 'react';
import Banner from '../atoms/Banner';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import FavoriteForm from '../atoms/Favorite/FavoriteForm';
import { DefaultFavorite, type Favorite } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { getRecordsFromStorage } from '../../utils/storage';
import { fakeFavorites, fakeFavoriteTypes } from '../../mocked/favorites';
import FavoriteList from '../atoms/Favorite/FavoriteList';
import AddFavoriteCard from '../atoms/Favorite/AddFavoriteCard';

const favoriteSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' },
  { value: 'notes', label: 'Notes' }
];
const favoriteSortByOptions: { value: string; label: string }[] = [];

const FavoriteDemoPage: React.FC = () => {
  const [isLoadingFavorites, setIsLoadingFavorites] = useState<boolean>(true);
  const [isLoadingFavoriteTypes, setIsLoadingFavoriteTypes] = useState<boolean>(true);
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
  const [newTypeModalOpen, setNewTypeModalOpen] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState('');
  const [favoriteTypes, setFavoriteTypesTypes] = useState<string[]>([]);
  const [removeTypeModalOpen, setRemoveTypeModalOpen] = useState(false);
  const [selectedTypeToRemove, setSelectedTypeToRemove] = useState('');

  const filteredFavorites = favorites.filter((f: Favorite) => {
    if (searchBy === 'tags') {
      return f.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else if (searchBy === 'notes') {
      return f.notes.toLowerCase().includes(search.toLowerCase());
    } else {
      return f.name.toLowerCase().includes(search.toLowerCase());
    }
  });

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
    if (isLoadingFavorites) {
      const savedFavorites = getRecordsFromStorage('favorites', [...fakeFavorites]);
      setFavorites(savedFavorites);
      setIsLoadingFavorites(false);
    }
  }, [isLoadingFavorites]);

  useEffect(() => {
    if (isLoadingFavoriteTypes) {
      const savedFavoriteTypes = getRecordsFromStorage('favorite-types', [...fakeFavoriteTypes]);
      setFavoriteTypesTypes(savedFavoriteTypes);
      setIsLoadingFavoriteTypes(false);
    }
  }, [isLoadingFavoriteTypes]);

  const handleSubmit = async (payload: Favorite[]) => {
    localStorage.setItem('favorites', JSON.stringify(payload));
    setShowBanner({ show: true, type: 'success' });
    setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
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

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultFavorite);
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

  const handleChangeSearchBy = (filter: string) => {
    setSearchBy(filter);
  };

  const handleChangeSortBy = (val: string) => setSortBy(val);

  const handleOpenCSVModal = () => setShowCSVModal(true);
  const handleCloseCSVModal = () => setShowCSVModal(false);
  const handleOpenJSONModal = () => setShowJSONModal(true);
  const handleCloseJSONModal = () => setShowJSONModal(false);

  const handleAddNewType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!favoriteTypes.includes(newTypeInput)) {
      const updatedFavoriteTypes = favoriteTypes.concat(newTypeInput);
      localStorage.setItem('favorite-types', JSON.stringify(updatedFavoriteTypes));
      setShowBanner({ show: true, type: 'success' });
      setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
    } else {
      setShowBanner({ show: true, type: 'fail' });
      setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
    }
    setNewTypeInput('');
    setNewTypeModalOpen(false);
  };

  const handleRemoveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypeToRemove && favoriteTypes.includes(selectedTypeToRemove)) {
      const updatedFavoriteTypes = favoriteTypes.filter(type => type !== selectedTypeToRemove);
      localStorage.setItem('favorite-types', JSON.stringify(updatedFavoriteTypes));
      setFavoriteTypesTypes(updatedFavoriteTypes);
      setShowBanner({ show: true, type: 'success' });
      setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
    }
    setSelectedTypeToRemove('');
    setRemoveTypeModalOpen(false);
  };

  const startAdd = () => {
    setEditForm(DefaultFavorite);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
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
        <div className='favorites-action-wrapper'>
          <AddFavoriteCard onClick={startAdd} />
          <div className='favorites-type-btn-wrapper'>
            <button
              className="primary-btn"
              onClick={() => setNewTypeModalOpen(true)}
            >
              + Type
            </button>
            <button
              className="negative-btn"
              onClick={() => setRemoveTypeModalOpen(true)}
            >
              - Type
            </button>
          </div>
        </div>
        <Modal isOpen={newTypeModalOpen} onClose={() => setNewTypeModalOpen(false)} title="Add New Favorite Type">
          <form onSubmit={handleAddNewType} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              value={newTypeInput}
              onChange={e => setNewTypeInput(e.target.value)}
              placeholder="Enter new type name"
              autoFocus
              required
            />
            <div className="form-actions-wrapper">

              <button className="form-submit" type="submit">
                Submit
              </button>
              <button className="form-cancel-btn" onClick={() => setNewTypeModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        <Modal isOpen={removeTypeModalOpen} onClose={() => setRemoveTypeModalOpen(false)} title="Remove Favorite Type">
          <form onSubmit={handleRemoveType} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              value={selectedTypeToRemove}
              onChange={e => setSelectedTypeToRemove(e.target.value)}
              required
            >
              <option value="">Select a type to remove</option>
              {favoriteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="form-actions-wrapper">

              <button className="form-submit" type="submit">
                Submit
              </button>
              <button className="form-cancel-btn" onClick={() => setRemoveTypeModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        {!isLoadingFavorites ? (
          <div className="favorite-cards-container">
            {favoriteTypes.map(type => (
              <FavoriteList
                type={type}
                filteredFavorites={filteredFavorites}
                onEditFavorite={(favorite: Favorite) => {
                  setEditForm(favorite);
                  setIsEditing(true);
                  setIsAddMode(false);
                  setIsPanelOpen(true);
                }}
              />))}
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
          cancelEdit={cancelEdit}
          favoriteTypes={favoriteTypes}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default FavoriteDemoPage;
