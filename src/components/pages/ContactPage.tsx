import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import { DefaultContact, type Contact } from '../../model/tracker';
import ContactCard from '../atoms/Contact/ContactCard';
import ContactForm from '../atoms/Contact/ContactForm';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const CONTACTS_PER_PAGE = 24;
const contactSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Address' },
  { value: 'tags', label: 'Tags' },
];
const contactSortByOptions: { value: string; label: string }[] = [];

const ContactPage: React.FC = () => {
  const { data: contacts = [], isLoading: isLoadingContacts } = useLoadRecordsByType<Contact>('contacts');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Contact>(DefaultContact);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredContacts = contacts.filter((c: Contact) => {
    if (searchBy === 'phone') {
      return c.phone.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'email') {
      return c.email.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'address') {
      return c.address.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return c.tags.toLowerCase().includes(search.toLowerCase());
    } else {
      return c.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => a.name.localeCompare(b.name));
  const totalPages = Math.ceil(sortedContacts.length / CONTACTS_PER_PAGE);
  const paginatedContacts = sortedContacts.slice((currentPage - 1) * CONTACTS_PER_PAGE, currentPage * CONTACTS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      contacts.flatMap((contact) =>
        contact.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, contacts.length]);

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

  const handleSubmit = async (payload: Contact[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'contacts' });
  };

  const handleAddContact = (form: Contact) => {
    const newContact = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(contacts.map(i => i.name), form.name);
    if (!isThereADuplicate) {
      const updatedContacts = [newContact, ...contacts];
      handleSubmit(updatedContacts);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultContact);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditContact = (form: Contact) => {
    const updatedContacts = contacts.map((c) =>
      c.name === form.name && c.email === form.email
        ? {
          ...form,
          name: capitalizeEachWord(form.name),
        }
        : c
    );
    handleSubmit(updatedContacts);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultContact);
  };

  const startEdit = (selectedContact: Contact, isClone?: boolean) => {
    setEditForm(selectedContact);
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultContact);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultContact);
  };

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDeleteContact = () => {
    if (contactToDelete) {
      const updatedContacts = contacts.filter(
        (c) => !(c.name === contactToDelete.name && c.email === contactToDelete.email)
      );
      handleSubmit(updatedContacts);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const cancelDeleteContact = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
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
      <h1 className="page-title">Contacts</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={contactSearchByOptions}
        sortByOptions={contactSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingContacts ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedContacts.map((contact, idx) => (
              <ContactCard
                key={idx}
                contact={contact}
                onEdit={() => {
                  startEdit(contact);
                }}
                onClone={() => {
                  startEdit(contact, true);
                }}
                onDelete={() => handleDeleteContact(contact)}
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
        onClose={cancelDeleteContact}
        title={contactToDelete ? `Are you sure you want to delete "${contactToDelete.name}"?` : 'Error missing contact'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteContact}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteContact}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(contacts))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(contacts)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(contacts))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(contacts)}</pre>
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
        title={isEditing ? 'Updating existing' : 'Add a New Contact'}
      >
        <ContactForm
          onSubmit={isEditing ? handleEditContact : handleAddContact}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default ContactPage; 