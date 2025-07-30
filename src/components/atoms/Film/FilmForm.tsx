import React, { useState, useEffect } from 'react';
import { DefaultFilm, serviceType, type Film } from '../../../model/library';
import { getRankStars } from '../../../utils/contentMapper';

interface FilmFormProps {
  onSubmit: (form: Film) => void;
  initialValues?: Film;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function FilmForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: FilmFormProps) {
  const [form, setForm] = useState<Film>(DefaultFilm);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rank' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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
        Film Name:
        <input disabled={isEditing} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
        <a
          className="form-id-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(form.name + ' film')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          G
        </a>
      </label>
      <label className="form-label">
        Rank: <span className="form-rank-text">{getRankStars(form.rank)}</span>
        <input
          className="form-input"
          type="range"
          name="rank"
          value={form.rank}
          min={1}
          max={5}
          onChange={handleChange}
        />
      </label>
      <label className="form-label">
        Service:
        <select className="form-input" name="service" value={form.service} onChange={handleChange} required>
          {serviceType
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

export default FilmForm;
