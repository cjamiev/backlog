import React, { useState, useEffect } from 'react';
import type { Note } from '../../../model/library';

interface NoteFormProps {
  onSubmit: (form: Note) => void;
  initialValues: Note;
  cancelEdit: () => void;
  allTags: string[];
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, initialValues, cancelEdit, allTags }) => {
  const [form, setForm] = useState<Note>(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formWithAddedDate = form.createdDate ? {
      ...form,
      updatedDate: new Date().toString(),
    } : {
      ...form,
      createdDate: new Date().toString(),
    }
    onSubmit(formWithAddedDate);
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
      <label className="form-label">
        Note Name:
        <input
          className="form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>
      <label className="form-label">
        Details:
      </label>
      <textarea
        className="form-input"
        name="details"
        value={form.details}
        onChange={handleChange}
        rows={24}
        required
      />
      <label className="form-label">
        Tags (comma separated):
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="form-input"
        />
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
          Save
        </button>
        <button className="form-cancel-btn" type="button" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm; 