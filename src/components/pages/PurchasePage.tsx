import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import PurchaseCard from '../atoms/Purchase/PurchaseCard';
import PurchaseForm from '../atoms/Purchase/PurchaseForm';
import { DefaultPurchase, type Purchase } from '../../model/tracker';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON, getRankStars } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const GAMES_PER_PAGE = 24;
const purchaseSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' }
];
const purchaseSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const PurchasePage: React.FC = () => {
  const { data: purchases = [], isLoading: isLoadingPurchases } = useLoadRecordsByType<Purchase>('purchases');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Purchase>(DefaultPurchase);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

  const filteredPurchases = purchases.filter((g: Purchase) => {
    if (searchBy === 'tags') {
      return g.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return g.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.rank - a.rank;
    }
  });
  const totalPages = Math.ceil(sortedPurchases.length / GAMES_PER_PAGE);
  const paginatedPurchases = sortedPurchases.slice((currentPage - 1) * GAMES_PER_PAGE, currentPage * GAMES_PER_PAGE);

  const allTags = Array.from(
    new Set(
      purchases.flatMap((purchase) =>
        purchase.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, purchases.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_ERROR });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isError]);

  const handleSubmit = async (payload: Purchase[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'purchases' });
  };

  const handleAddPurchase = (form: Purchase) => {
    const newPurchase = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(purchases.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedPurchases = [newPurchase, ...purchases];
      handleSubmit(updatedPurchases);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultPurchase);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditPurchase = (form: Purchase) => {
    const updatedPurchases = purchases.map((g) =>
      g.name === form.name
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : g
    );
    handleSubmit(updatedPurchases);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPurchase);
  };

  const startEdit = (selectedPurchase: Purchase, isClone?: boolean) => {
    setEditForm(selectedPurchase);
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultPurchase);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPurchase);
  };

  const handleDeletePurchase = (purchase: Purchase) => {
    setPurchaseToDelete(purchase);
    setShowDeleteModal(true);
  };

  const confirmDeletePurchase = () => {
    if (purchaseToDelete) {
      const updatedPurchases = purchases.filter((g) => g.name !== purchaseToDelete.name);
      handleSubmit(updatedPurchases);
      setShowDeleteModal(false);
      setPurchaseToDelete(null);
    }
  };

  const cancelDeletePurchase = () => {
    setShowDeleteModal(false);
    setPurchaseToDelete(null);
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
      <h1 className="page-title">Purchases</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={purchaseSearchByOptions}
        sortByOptions={purchaseSortByOptions}
      />
      {!showTableView ? <div className="page-body-layout">
        {!isLoadingPurchases ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedPurchases.map((purchase, idx) => (
              <PurchaseCard
                key={idx}
                purchase={purchase}
                onEdit={() => {
                  startEdit(purchase);
                }}
                onClone={() => {
                  startEdit(purchase, true);
                }}
                onDelete={() => handleDeletePurchase(purchase)}
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
          {sortedPurchases.filter(purchase => purchase.rank === 5).map(purchase => <div key={purchase.name} className='list-item' onClick={() => { startEdit(purchase); }}>{purchase.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(4)}</label>
          {sortedPurchases.filter(purchase => purchase.rank === 4).map(purchase => <div key={purchase.name} className='list-item' onClick={() => { startEdit(purchase); }}>{purchase.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(3)}</label>
          {sortedPurchases.filter(purchase => purchase.rank === 3).map(purchase => <div key={purchase.name} className='list-item' onClick={() => { startEdit(purchase); }}>{purchase.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(2)}</label>
          {sortedPurchases.filter(purchase => purchase.rank === 2).map(purchase => <div key={purchase.name} className='list-item' onClick={() => { startEdit(purchase); }}>{purchase.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(1)}</label>
          {sortedPurchases.filter(purchase => purchase.rank === 1).map(purchase => <div key={purchase.name} className='list-item' onClick={() => { startEdit(purchase); }}>{purchase.name}</div>)}
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
        onClose={cancelDeletePurchase}
        title={purchaseToDelete ? `Are you sure you want to delete "${purchaseToDelete.name}"?` : 'Error missing purchase'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeletePurchase}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeletePurchase}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(purchases))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(purchases)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(purchases))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(purchases)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Purchase'}
      >
        <PurchaseForm
          onSubmit={isEditing ? handleEditPurchase : handleAddPurchase}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default PurchasePage;
