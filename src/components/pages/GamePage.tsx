import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
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
import { fakeGames } from '../../mocked/games';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorage } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

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
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(true);
  const [games, setGames] = useState<Game[]>([]);

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
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

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
      return a.rank - b.rank;
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
    if (isBackendAvailable && isLoadingGames) {
      loadRecordsByType('games').then((records: Game[]) => {
        setGames(records);
        setIsLoadingGames(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedGames = getRecordsFromStorage('games', [...fakeGames]);
      setGames(savedGames);
      setIsLoadingGames(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingGames]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, games.length]);

  const handleSubmit = async (payload: Game[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('games', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'games')
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

  const handleAddGame = (form: Game) => {
    const newGame = {
      name: form.name,
      rank: form.rank,
      lowestPrice: form.lowestPrice,
      tags: form.tags
    };
    setGames((prev) => {
      const updatedGames = [newGame, ...prev];
      handleSubmit(updatedGames);
      return updatedGames;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultGame);
    setSearch('');
  };

  const handleEditGame = (form: Game) => {
    setGames((prev) => {
      const updatedGames = prev.map((g) =>
        g.name === form.name
          ? {
              name: form.name,
              rank: form.rank,
              lowestPrice: form.lowestPrice,
              tags: form.tags
            }
          : g
      );

      handleSubmit(updatedGames);
      return updatedGames;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultGame);
  };

  const startEdit = (selectedGame: Game, isClone?: boolean) => {
    setEditForm({
      name: selectedGame.name,
      rank: selectedGame.rank,
      lowestPrice: selectedGame.lowestPrice,
      tags: selectedGame.tags
    });
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
      setGames((prev) => {
        const updatedGames = prev.filter((g) => g.name !== gameToDelete.name);
        handleSubmit(updatedGames);
        return updatedGames;
      });
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
      <div className="page-body-layout">
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
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Game'}
      >
        <GameForm
          onSubmit={isEditing ? handleEditGame : handleAddGame}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default GamePage;
