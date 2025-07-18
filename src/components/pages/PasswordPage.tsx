import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
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
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';

const PASSWORDS_PER_PAGE = 24;
const passwordSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'tags', label: 'Tags' },
];
const passwordSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'updatedDate', label: 'Updated Date' }
];

const PasswordPage: React.FC = () => {
  const { data: passwords = [], isLoading: isLoadingPasswords } = useLoadRecordsByType<Password>('passwords');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

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
    } else if (searchBy === 'tags') {
      return p.tags.toLowerCase().includes(search.toLowerCase());
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

  const allTags = Array.from(
    new Set(
      passwords.flatMap((password) =>
        password.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, passwords.length]);

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

  const handleSubmit = async (payload: Password[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'passwords' });
  };

  const handleAddPassword = (form: Password) => {
    const newPassword = {
      name: form.name,
      username: form.username,
      password: form.password,
      updatedDate: form.updatedDate,
      link: form.link,
      tags: form.tags
    };
    const updatedPasswords = [newPassword, ...passwords];
    handleSubmit(updatedPasswords);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
    setSearch('');
  };

  const handleEditPassword = (form: Password) => {
    const updatedPasswords = passwords.map((p) =>
      p.name === form.name && p.username === form.username
        ? {
          name: form.name,
          username: form.username,
          password: form.password,
          updatedDate: form.updatedDate,
          link: form.link,
          tags: form.tags
        }
        : p
    );
    handleSubmit(updatedPasswords);
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
      link: selectedPassword.link,
      tags: selectedPassword.tags
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
      const updatedPasswords = passwords.filter(
        (p) => !(p.name === passwordToDelete.name && p.username === passwordToDelete.username)
      );
      handleSubmit(updatedPasswords);
      setShowDeleteModal(false);
      setPasswordToDelete(null);
    }
  };

  const cancelDeletePassword = () => {
    setShowDeleteModal(false);
    setPasswordToDelete(null);
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
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default PasswordPage;
