import React, { useState, useEffect } from 'react';
import { DefaultInterval, type Interval } from '../../../model/gamedev';

interface IntervalFormProps {
  onSubmit: (form: Interval) => void;
  initialValues?: Interval;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function IntervalForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: IntervalFormProps) {
  const [form, setForm] = useState<Interval>(DefaultInterval);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
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
      <label className="form-label">
        Name:
        <input disabled={isEditing} className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Origin:
        <input disabled={isEditing} className="form-input" type="text" name="origin" value={form.origin} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Links:
        <textarea
          className="form-input"
          name="links"
          value={form.links}
          onChange={handleChange}
          rows={3}
        />
      </label>
      <label className="form-label">
        Details:
        <textarea
          className="form-input"
          name="details"
          value={form.details}
          onChange={handleChange}
          rows={10}
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

export default IntervalForm;
