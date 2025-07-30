import React, { useState, useEffect } from 'react';
import { DefaultReference, type Reference } from '../../../model/library';

interface ReferenceFormProps {
  onSubmit: (form: Reference) => void;
  initialValues?: Reference;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function ReferenceForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: ReferenceFormProps) {
  const [form, setForm] = useState<Reference>(DefaultReference);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        Reference:
        <input disabled={isEditing} className="form-input" type="text" name="value" value={form.value} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Origin:
        <input className="form-input" type="text" name="origin" value={form.origin} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Definition:
        <textarea
          className="form-input"
          name="definition"
          value={form.definition}
          onChange={handleChange}
          rows={3}
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

export default ReferenceForm;
