import React, { useState, useEffect } from 'react';
import { bookTypes, DefaultBook, type Book } from '../../../model/library';

interface BookFormProps {
  onSubmit: (form: Book) => void;
  initialValues?: Book;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function BookForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: BookFormProps) {
  const [form, setForm] = useState<Book>(DefaultBook);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(DefaultBook);
  };

  const handleTagClick = (tag: string) => {
    const currentTags = form.tags ? form.tags.split(',').map((t) => t.trim()) : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setForm((prev) => ({ ...prev, tags: newTags }));
    }
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-id">
        Book Name:
        <input disabled={isEditing} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
        <a
          className="form-id-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(form.name + ' book')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          G
        </a>
      </label>
      <label className="form-label">
        Author:
        <input type="text" name="author" value={form.author} onChange={handleChange} className="form-input" />
      </label>
      <label className="form-label">
        Type:
        <select className="form-input" name="type" value={form.type} onChange={handleChange} required>
          {bookTypes
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </label>
      <label className="form-label">
        Tags (comma separated):
        <input type="text" name="tags" value={form.tags} onChange={handleChange} className="form-input" />
      </label>
      <div className="tags-wrapper">
        <div className="tags-title">Available Tags:</div>
        <div className="tags-container">
          {allTags.map((tag, idx) => (
            <button key={idx} className="tag-btn" type="button" onClick={() => handleTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="form-actions-wrapper">
        <button className="form-submit" type="submit">
          Submit
        </button>
        <button className="form-cancel-btn" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BookForm;
