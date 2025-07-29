import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import GameCard from '../atoms/Game/GameCard';
import GameForm from '../atoms/Game/GameForm';
import { DefaultGame, type Game } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON, getRankStars } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const GAMES_PER_PAGE = 24;
const gameSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' }
];
const gameSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const GamePage: React.FC = () => {
  const { data: games = [], isLoading: isLoadingGames } = useLoadRecordsByType<Game>('games');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Game>(DefaultGame);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

  const filteredGames = games.filter((g: Game) => {
    if (searchBy === 'tags') {
      return g.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return g.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.rank - a.rank;
    }
  });
  const totalPages = Math.ceil(sortedGames.length / GAMES_PER_PAGE);
  const paginatedGames = sortedGames.slice((currentPage - 1) * GAMES_PER_PAGE, currentPage * GAMES_PER_PAGE);

  const allTags = Array.from(
    new Set(
      games.flatMap((game) =>
        game.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, games.length]);

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

  const handleSubmit = async (payload: Game[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'games' });
  };

  const handleAddGame = (form: Game) => {
    const newGame = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(games.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedGames = [newGame, ...games];
      handleSubmit(updatedGames);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultGame);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditGame = (form: Game) => {
    const updatedGames = games.map((g) =>
      g.name === form.name
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : g
    );
    handleSubmit(updatedGames);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultGame);
  };

  const startEdit = (selectedGame: Game, isClone?: boolean) => {
    setEditForm(selectedGame);
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultGame);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultGame);
  };

  const handleDeleteGame = (game: Game) => {
    setGameToDelete(game);
    setShowDeleteModal(true);
  };

  const confirmDeleteGame = () => {
    if (gameToDelete) {
      const updatedGames = games.filter((g) => g.name !== gameToDelete.name);
      handleSubmit(updatedGames);
      setShowDeleteModal(false);
      setGameToDelete(null);
    }
  };

  const cancelDeleteGame = () => {
    setShowDeleteModal(false);
    setGameToDelete(null);
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
      <h1 className="page-title">Games</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={gameSearchByOptions}
        sortByOptions={gameSortByOptions}
      />
      {!showTableView ? <div className="page-body-layout">
        {!isLoadingGames ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedGames.map((game, idx) => (
              <GameCard
                key={idx}
                game={game}
                onEdit={() => {
                  startEdit(game);
                }}
                onClone={() => {
                  startEdit(game, true);
                }}
                onDelete={() => handleDeleteGame(game)}
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
          {sortedGames.filter(game => game.rank === 5).map(game => <div key={game.name} className='list-item' onClick={() => { startEdit(game); }}>{game.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(4)}</label>
          {sortedGames.filter(game => game.rank === 4).map(game => <div key={game.name} className='list-item' onClick={() => { startEdit(game); }}>{game.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(3)}</label>
          {sortedGames.filter(game => game.rank === 3).map(game => <div key={game.name} className='list-item' onClick={() => { startEdit(game); }}>{game.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(2)}</label>
          {sortedGames.filter(game => game.rank === 2).map(game => <div key={game.name} className='list-item' onClick={() => { startEdit(game); }}>{game.name}</div>)}
        </div>
        <div className='list-section'>
          <label>{getRankStars(1)}</label>
          {sortedGames.filter(game => game.rank === 1).map(game => <div key={game.name} className='list-item' onClick={() => { startEdit(game); }}>{game.name}</div>)}
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
        onClose={cancelDeleteGame}
        title={gameToDelete ? `Are you sure you want to delete "${gameToDelete.name}"?` : 'Error missing game'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteGame}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteGame}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(games))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(games)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(games))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(games)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Game'}
      >
        <GameForm
          onSubmit={isEditing ? handleEditGame : handleAddGame}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default GamePage;
