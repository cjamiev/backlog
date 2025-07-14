import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import PasswordCard from '../atoms/Password/PasswordCard';
import PasswordForm from '../atoms/Password/PasswordForm';
import { DefaultPassword, type Password } from '../../model/library';
import { fakePasswords } from '../../mocked/passwords';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorage } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const PASSWORDS_PER_PAGE = 24;
const passwordSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' }
];
const passwordSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'updatedDate', label: 'Updated Date' }
];

const PasswordPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingPasswords, setIsLoadingPasswords] = useState<boolean>(true);
  const [passwords, setPasswords] = useState<Password[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Password>(DefaultPassword);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPasswords = passwords.filter((p: Password) => {
    if (searchBy === 'username') {
      return p.username.toLowerCase().includes(search.toLowerCase());
    } else {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedPasswords = [...filteredPasswords].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
    }
  });
  const totalPages = Math.ceil(sortedPasswords.length / PASSWORDS_PER_PAGE);
  const paginatedPasswords = sortedPasswords.slice(
    (currentPage - 1) * PASSWORDS_PER_PAGE,
    currentPage * PASSWORDS_PER_PAGE
  );

  useEffect(() => {
    if (isBackendAvailable && isLoadingPasswords) {
      loadRecordsByType('passwords').then((records: Password[]) => {
        setPasswords(records);
        setIsLoadingPasswords(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedPasswords = getRecordsFromStorage('passwords', [...fakePasswords]);
      setPasswords(savedPasswords);
      setIsLoadingPasswords(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingPasswords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, passwords.length]);

  const handleSubmit = async (payload: Password[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('passwords', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'passwords')
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

  const handleAddPassword = (form: Password) => {
    const newPassword = {
      name: form.name,
      username: form.username,
      password: form.password,
      updatedDate: form.updatedDate,
      link: form.link
    };
    setPasswords((prev) => {
      const updatedPasswords = [newPassword, ...prev];
      handleSubmit(updatedPasswords);
      return updatedPasswords;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
    setSearch('');
  };

  const handleEditPassword = (form: Password) => {
    setPasswords((prev) => {
      const updatedPasswords = prev.map((p) =>
        p.name === form.name && p.username === form.username
          ? {
              name: form.name,
              username: form.username,
              password: form.password,
              updatedDate: form.updatedDate,
              link: form.link
            }
          : p
      );

      handleSubmit(updatedPasswords);
      return updatedPasswords;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
  };

  const startEdit = (selectedPassword: Password, isClone?: boolean) => {
    setEditForm({
      name: selectedPassword.name,
      username: selectedPassword.username,
      password: selectedPassword.password,
      updatedDate: selectedPassword.updatedDate,
      link: selectedPassword.link
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultPassword);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
  };

  const handleDeletePassword = (password: Password) => {
    setPasswordToDelete(password);
    setShowDeleteModal(true);
  };

  const confirmDeletePassword = () => {
    if (passwordToDelete) {
      setPasswords((prev) => {
        const updatedPasswords = prev.filter(
          (p) => !(p.name === passwordToDelete.name && p.username === passwordToDelete.username)
        );
        handleSubmit(updatedPasswords);
        return updatedPasswords;
      });
      setShowDeleteModal(false);
      setPasswordToDelete(null);
    }
  };

  const cancelDeletePassword = () => {
    setShowDeleteModal(false);
    setPasswordToDelete(null);
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
      <h1 className="page-title">Passwords</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={passwordSearchByOptions}
        sortByOptions={passwordSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingPasswords ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedPasswords.map((password, idx) => (
              <PasswordCard
                key={idx}
                password={password}
                onEdit={() => {
                  startEdit(password);
                }}
                onClone={() => {
                  startEdit(password, true);
                }}
                onDelete={() => handleDeletePassword(password)}
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
        onClose={cancelDeletePassword}
        title={
          passwordToDelete ? `Are you sure you want to delete "${passwordToDelete.name}"?` : 'Error missing password'
        }
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeletePassword}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeletePassword}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(passwords))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(passwords)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(passwords))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(passwords)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Password'}
      >
        <PasswordForm
          onSubmit={isEditing ? handleEditPassword : handleAddPassword}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
        />
      </Sidepanel>
    </div>
  );
};

export default PasswordPage;
