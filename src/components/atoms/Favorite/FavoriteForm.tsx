import React, { useState, useEffect } from 'react';
import { DefaultFavorite, type Favorite, FAVORITE_TYPE } from '../../../model/library';

interface FavoriteFormProps {
  onSubmit: (form: Favorite) => void;
  initialValues?: Favorite;
  isEditing: boolean;
  cancelEdit: () => void;
  allTags: string[];
}

function FavoriteForm({ onSubmit, initialValues, isEditing, cancelEdit, allTags }: FavoriteFormProps) {
  const [form, setForm] = useState<Favorite>(DefaultFavorite);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'type' ? Number(value) : value }));
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

  const getTypeLabel = (type: FAVORITE_TYPE): string => {
    switch (type) {
      case FAVORITE_TYPE.art:
        return 'Art';
      case FAVORITE_TYPE.music:
        return 'Music';
      case FAVORITE_TYPE.game:
        return 'Game';
      case FAVORITE_TYPE.programming:
        return 'Programming';
      case FAVORITE_TYPE.entertainment:
        return 'Entertainment';
      case FAVORITE_TYPE.other:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Favorite Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
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
          {Object.values(FAVORITE_TYPE)
            .filter((value) => typeof value === 'number')
            .map((type) => (
              <option key={type} value={type}>
                {getTypeLabel(type as FAVORITE_TYPE)}
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
        {isEditing && (
          <button className="form-cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default FavoriteForm;
