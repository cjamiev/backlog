import React, { useState, useEffect } from 'react';
import { DefaultGame, type Game } from '../../../model/entertainment';
import { getRankStars } from '../../../utils/contentMapper';

interface GameFormProps {
  onSubmit: (form: Game) => void;
  initialValues?: Game;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function GameForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: GameFormProps) {
  const [form, setForm] = useState<Game>(DefaultGame);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        Name:
        <input disabled={isEditing} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
        <a
          className="form-id-link"
          href={`https://www.google.com/search?q=${encodeURIComponent(form.name + ' game')}`}
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
        Lowest Price:
        <input
          className="form-input"
          type="text"
          name="lowestPrice"
          value={form.lowestPrice}
          onChange={handleChange}
          placeholder="e.g., $29.99"
        />
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

export default GameForm;
