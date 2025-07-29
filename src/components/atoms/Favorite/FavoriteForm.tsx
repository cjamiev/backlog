import React, { useState, useEffect } from 'react';
import { DefaultFavorite, type Favorite } from '../../../model/library';

interface FavoriteFormProps {
  onSubmit: (form: Favorite) => void;
  initialValues?: Favorite;
  cancelEdit: () => void;
  favoriteTypes: string[];
  allTags: string[];
  isEditing: boolean;
}

function FavoriteForm({ onSubmit, initialValues, cancelEdit, favoriteTypes, allTags, isEditing }: FavoriteFormProps) {
  const [form, setForm] = useState<Favorite>(DefaultFavorite);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialValues,
        type: favoriteTypes[0],
      });
    }
  }, [initialValues, favoriteTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(DefaultFavorite);
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
        Favorite Name:
        <input disabled={isEditing} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Link:
        <input
          className="form-input"
          type="url"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />
      </label>
      <label className="form-label">
        Type:
        <select className="form-input" name="type" value={form.type} onChange={handleChange} required>
          {favoriteTypes
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
      <label className="form-label">
        Notes:
        <textarea
          className="form-textarea"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Add any notes about this favorite..."
        />
      </label>
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

export default FavoriteForm;
