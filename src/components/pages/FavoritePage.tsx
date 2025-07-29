import React, { useState, useEffect } from 'react';
import Banner from '../atoms/Banner';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import FavoriteForm from '../atoms/Favorite/FavoriteForm';
import { DefaultFavorite, type Favorite } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import FavoriteList from '../atoms/Favorite/FavoriteList';
import AddFavoriteCard from '../atoms/Favorite/AddFavoriteCard';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const favoriteSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' },
  { value: 'notes', label: 'Notes' }
];
const favoriteSortByOptions: { value: string; label: string }[] = [];

const FavoritePage: React.FC = () => {
  const { data: favorites = [], isLoading: isLoadingFavorites } = useLoadRecordsByType<Favorite>('favorites');
  const { data: favoriteTypes = [], isLoading: isLoadingFavoriteTypes } = useLoadRecordsByType<string>('favorite-types');
  const { mutate: mutateFavorites, isSuccess: isFavoritesUpdateSuccess, isError: isFavoritesUpdateError } = useUpdateRecordsByType();
  const { mutate: mutateFavoriteTypes, isSuccess: isFavoriteTypesUpdateSuccess, isError: isFavoriteTypesUpdateError } = useUpdateRecordsByType();


  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Favorite>(DefaultFavorite);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState<Favorite | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [newTypeModalOpen, setNewTypeModalOpen] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState('');
  const [removeTypeModalOpen, setRemoveTypeModalOpen] = useState(false);
  const [selectedTypeToRemove, setSelectedTypeToRemove] = useState('');
  const [showTagsModal, setShowTagsModal] = useState(false);

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
    if (isFavoritesUpdateSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isFavoritesUpdateSuccess]);

  useEffect(() => {
    if (isFavoritesUpdateError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isFavoritesUpdateError]);

  useEffect(() => {
    if (isFavoriteTypesUpdateSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isFavoriteTypesUpdateSuccess]);

  useEffect(() => {
    if (isFavoriteTypesUpdateError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isFavoriteTypesUpdateError]);

  const handleSubmit = async (payload: Favorite[]) => {
    mutateFavorites({ payload: JSON.stringify(payload), type: 'favorites' })
  };

  const handleTypesSubmit = async (payload: string[]) => {
    mutateFavoriteTypes({ payload: JSON.stringify(payload), type: 'favorite-types' })
  };

  const handleAddFavorite = (form: Favorite) => {
    const newFavorite = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(favorites.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedFavorites = [newFavorite, ...favorites];
      handleSubmit(updatedFavorites);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultFavorite);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditFavorite = (form: Favorite) => {
    const updatedFavorites = favorites.map((f) =>
      f.name === form.name && f.link === form.link
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : f
    );
    handleSubmit(updatedFavorites);

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

  const handleRemoveFavorite = (selectedFavorite: Favorite) => {
    setFavoriteToDelete(selectedFavorite);
    setShowDeleteModal(true);
  };

  const confirmDeleteFavorite = () => {
    if (favoriteToDelete) {
      const updatedFavorites = favorites.filter(
        (f) => !(f.name === favoriteToDelete.name && f.link === favoriteToDelete.link)
      );
      handleSubmit(updatedFavorites);

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

  const handleOpenTypeModal = () => setShowTypeModal(true);
  const handleCloseTypeModal = () => setShowTypeModal(false);
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

  const handleAddNewType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!favoriteTypes.includes(newTypeInput)) {
      const updatedFavoriteTypes = favoriteTypes.concat(newTypeInput);
      handleTypesSubmit(updatedFavoriteTypes);

      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    } else {
      setShowBanner({ isVisible: true, type: 'fail', message: BANNER_MESSAGES.SAVE_ERROR });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
    setNewTypeInput('');
    setNewTypeModalOpen(false);
  };

  const handleRemoveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypeToRemove && favoriteTypes.includes(selectedTypeToRemove)) {
      const updatedFavoriteTypes = favoriteTypes.filter(type => type !== selectedTypeToRemove);
      handleTypesSubmit(updatedFavoriteTypes);

      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
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
      <Banner {...showBanner} />
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
        {!isLoadingFavoriteTypes ? (<div className='favorites-action-wrapper'>
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
        </div>) : (
          <div className="loading-container">Loading...</div>
        )}
        {!isLoadingFavorites ? (
          <div className="favorite-cards-container">
            {favoriteTypes.map(type => (
              <FavoriteList
                key={type}
                type={type}
                filteredFavorites={filteredFavorites.filter(favorite => favorite.type === type)}
                onEditFavorite={(favorite: Favorite) => {
                  setEditForm(favorite);
                  setIsEditing(true);
                  setIsAddMode(false);
                  setIsPanelOpen(true);
                }}
                onDeleteFavorite={handleRemoveFavorite}
              />))}
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div>
      <Modal isOpen={newTypeModalOpen} onClose={() => setNewTypeModalOpen(false)} title="Add New Favorite Type">
        <form className='favorite-type-modal-form' onSubmit={handleAddNewType}>
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
        <form className='favorite-type-modal-form' onSubmit={handleRemoveType}>
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
      <Modal isOpen={showTypeModal} onClose={handleCloseTypeModal} title="Favorite Type List">
        <div className="modal-data-display">
          <pre className="modal-data-content">{favoriteTypes.map(type => <div key={type}>{type}</div>)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Favorite'}
      >
        <FavoriteForm
          onSubmit={isEditing ? handleEditFavorite : handleAddFavorite}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          favoriteTypes={favoriteTypes}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
      <Footer>
        <div>
          <button className="primary-btn" onClick={handleOpenTypeModal}>
            Show Type List
          </button>
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
      </Footer>
    </div>
  );
};

export default FavoritePage;
