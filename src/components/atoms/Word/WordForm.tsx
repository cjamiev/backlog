import React, { useState, useEffect } from 'react';
import { DefaultWord, type Word, WORD_TYPE } from '../../../model/library';

interface WordFormProps {
  onSubmit: (form: Word) => void;
  initialValues?: Word;
  isEditing: boolean;
  cancelEdit: () => void;
  allTags: string[];
}

function WordForm({ onSubmit, initialValues, isEditing, cancelEdit, allTags }: WordFormProps) {
  const [form, setForm] = useState<Word>(DefaultWord);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'type' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(DefaultWord);
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
        Word:
        <input className="form-input" type="text" name="value" value={form.value} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Definition:
        <textarea
          className="form-input"
          name="definition"
          value={form.definition}
          onChange={handleChange}
          rows={3}
          required
        />
      </label>
      <label className="form-label">
        Type:
        <select className="form-input" name="type" value={form.type} onChange={handleChange}>
          <option value={WORD_TYPE.noun}>Noun</option>
          <option value={WORD_TYPE.adjective}>Adjective</option>
          <option value={WORD_TYPE.verb}>Verb</option>
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
        {isEditing && (
          <button className="form-cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default WordForm;
