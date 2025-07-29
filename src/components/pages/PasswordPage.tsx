import React, { useState, useEffect } from 'react';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import PasswordCard from '../atoms/Password/PasswordCard';
import PasswordForm from '../atoms/Password/PasswordForm';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, getCSV, getJSON } from '../../utils/contentMapper';
import { useAddNewPassword, useLoadPasswords, useUpdatePassword } from '../../api/password-service';
import { DefaultPassword, type Password } from '../../model/password';
import { getPasswordHistory } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const PASSWORDS_PER_PAGE = 24;
const passwordSearchByOptions = [
  { value: 'id', label: 'id' },
  { value: 'username', label: 'Username' },
  { value: 'tags', label: 'Tags' },
];
const passwordSortByOptions = [
  { value: 'id', label: 'id' },
  { value: 'createdDate', label: 'Created Date' }
];

const PasswordPage: React.FC = () => {
  const { data: passwords = [], isLoading: isLoadingPasswords } = useLoadPasswords();
  const { mutate: newPasswordMutate, isSuccess: isNewPasswordSuccess, isError: isNewPasswordError } = useAddNewPassword();
  const { mutate: updatePasswordMutate, isSuccess: isUpdatePasswordSuccess, isError: isUpdatePasswordError } = useUpdatePassword();

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
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredPasswords = passwords.filter((p: Password) => {
    if (searchBy === 'username') {
      return p.username.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return p.tags.toLowerCase().includes(search.toLowerCase());
    } else {
      return p.id.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedPasswords = [...filteredPasswords].sort((a, b) => {
    if (sortBy === 'id') {
      return a.id.localeCompare(b.id);
    } else {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
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
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, passwords.length]);

  useEffect(() => {
    if (isNewPasswordSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isNewPasswordSuccess]);

  useEffect(() => {
    if (isNewPasswordError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isNewPasswordError]);

  useEffect(() => {
    if (isUpdatePasswordSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isUpdatePasswordSuccess]);

  useEffect(() => {
    if (isUpdatePasswordError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isUpdatePasswordError]);

  const handleAddPassword = (form: Password) => {
    newPasswordMutate({
      payload: {
        ...form,
        id: capitalizeEachWord(form.id),
        createdDate: String(Date.now()),
        history: '[]'
      }
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
    setSearch('');
  };

  const handleEditPassword = (form: Password) => {
    updatePasswordMutate({ payload: form });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultPassword);
  };

  const startEdit = (selectedPassword: Password, isClone?: boolean) => {
    setEditForm({
      id: selectedPassword.id,
      username: selectedPassword.username,
      password: selectedPassword.password,
      createdDate: String(Date.now()),
      url: selectedPassword.url,
      tags: selectedPassword.tags,
      history: getPasswordHistory(selectedPassword, isClone)
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
      const archivedPassword = {
        ...passwordToDelete,
        tags: passwordToDelete.tags ? passwordToDelete.tags + ', archived' : 'archived'
      };
      updatePasswordMutate({ payload: archivedPassword });
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

  return (
    <div className="page-wrapper">
      <Banner {...showBanner} />
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
          <button className="primary-btn" onClick={handleOpenTagsModal}>
            Select A Tag
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
          passwordToDelete ? `Are you sure you want to delete "${passwordToDelete.id}"?` : 'Error missing password'
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
        title={isEditing ? 'Updating existing' : 'Add a New Password'}
      >
        <PasswordForm
          onSubmit={isEditing ? handleEditPassword : handleAddPassword}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default PasswordPage;
