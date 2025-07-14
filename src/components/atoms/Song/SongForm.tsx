import React, { useState, useEffect } from 'react';
import { DefaultSong, type Song } from '../../../model/library';

interface SongFormProps {
  onSubmit: (form: Song) => void;
  initialValues?: Song;
  isEditing: boolean;
  cancelEdit: () => void;
  allTags: string[];
}

function SongForm({ onSubmit, initialValues, isEditing, cancelEdit, allTags }: SongFormProps) {
  const [form, setForm] = useState<Song>(DefaultSong);

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
    setForm(DefaultSong);
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
        Song Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Album:
        <input className="form-input" type="text" name="album" value={form.album} onChange={handleChange} />
      </label>
      <label className="form-label">
        Band:
        <input className="form-input" type="text" name="band" value={form.band} onChange={handleChange} />
      </label>
      <label className="form-label">
        Rank: <span className="form-rank-text">{form.rank}</span>
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
        Link:
        <input className="form-input" type="text" name="link" value={form.link} onChange={handleChange} />
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
        {isEditing && (
          <button className="form-cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default SongForm;
