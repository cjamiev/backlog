import React, { useState, useEffect } from 'react';
import { DefaultShow, serviceType, type Show } from '../../../model/library';
import { getRankStars } from '../../../utils/contentMapper';

interface ShowFormProps {
  onSubmit: (show: Show) => void;
  initialValues: Show;
  cancelEdit: () => void;
  allTags: string[];
}

const ShowForm: React.FC<ShowFormProps> = ({ onSubmit, initialValues, cancelEdit, allTags }) => {
  const [form, setForm] = useState<Show>(initialValues);

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
    setForm(DefaultShow);
  };

  const handleTagClick = (tag: string) => {
    const currentTags = form.tags ? form.tags.split(',').map((t) => t.trim()) : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setForm((prev) => ({ ...prev, tags: newTags }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <label className="form-id">
        Show Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
        <a
          className="form-id-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(form.name + ' show')}`}
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
        <button type="submit" className="form-submit">
          Submit
        </button>
        <button type="button" onClick={cancelEdit} className="form-cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ShowForm;
