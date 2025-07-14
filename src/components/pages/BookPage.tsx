import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import BookCard from '../atoms/Book/BookCard';
import BookForm from '../atoms/Book/BookForm';
import { DefaultBook, type Book } from '../../model/library';
import { fakeBooks } from '../../mocked/books';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorage } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const BOOKS_PER_PAGE = 24;
const bookSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'tags', label: 'Tags' }
];
const bookSortByOptions: { value: string; label: string }[] = [];

const BookPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Book>(DefaultBook);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = books.filter((b: Book) => {
    if (searchBy === 'tags') {
      return b.tags.split(',').some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    } else {
      return b.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  const totalPages = Math.ceil(sortedBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = sortedBooks.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  const allTags = Array.from(
    new Set(
      books.flatMap((book) =>
        book.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (isBackendAvailable && isLoadingBooks) {
      loadRecordsByType('books').then((records: Book[]) => {
        setBooks(records);
        setIsLoadingBooks(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedBooks = getRecordsFromStorage('books', [...fakeBooks]);
      setBooks(savedBooks);
      setIsLoadingBooks(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingBooks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, books.length]);

  const handleSubmit = async (payload: Book[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('books', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'books')
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

  const handleAddBook = (form: Book) => {
    const newBook = {
      name: form.name,
      tags: form.tags
    };
    setBooks((prev) => {
      const updatedBooks = [newBook, ...prev];
      handleSubmit(updatedBooks);
      return updatedBooks;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultBook);
    setSearch('');
  };

  const handleEditBook = (form: Book) => {
    setBooks((prev) => {
      const updatedBooks = prev.map((b) =>
        b.name === form.name
          ? {
              name: form.name,
              tags: form.tags
            }
          : b
      );

      handleSubmit(updatedBooks);
      return updatedBooks;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultBook);
  };

  const startEdit = (selectedBook: Book, isClone?: boolean) => {
    setEditForm({
      name: selectedBook.name,
      tags: selectedBook.tags
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultBook);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultBook);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = () => {
    if (bookToDelete) {
      setBooks((prev) => {
        const updatedBooks = prev.filter((b) => b.name !== bookToDelete.name);
        handleSubmit(updatedBooks);
        return updatedBooks;
      });
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const cancelDeleteBook = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
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
      <h1 className="page-title">Books</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={bookSearchByOptions}
        sortByOptions={bookSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingBooks ? (
          <div className="cards-container">
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedBooks.map((book, idx) => (
              <BookCard
                key={idx}
                book={book}
                onEdit={() => {
                  startEdit(book);
                }}
                onClone={() => {
                  startEdit(book, true);
                }}
                onDelete={() => handleDeleteBook(book)}
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
        onClose={cancelDeleteBook}
        title={bookToDelete ? `Are you sure you want to delete "${bookToDelete.name}"?` : 'Error missing book'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteBook}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteBook}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(books))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(books)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(books))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(books)}</pre>
        </div>
      </Modal>
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Book'}
      >
        <BookForm
          onSubmit={isEditing ? handleEditBook : handleAddBook}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          allTags={allTags}
        />
      </Sidepanel>
    </div>
  );
};

export default BookPage;
