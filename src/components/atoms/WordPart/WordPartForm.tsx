import React, { useState, useEffect } from 'react';
import { DefaultWordPart, type WordPart, WORD_PART_TYPE } from '../../../model/library';

interface WordPartFormProps {
  onSubmit: (form: WordPart) => void;
  initialValues?: WordPart;
  cancelEdit: () => void;
}

function WordPartForm({ onSubmit, initialValues, cancelEdit }: WordPartFormProps) {
  const [form, setForm] = useState<WordPart>(DefaultWordPart);

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
    setForm(DefaultWordPart);
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Word Part:
        <input className="form-input" type="text" name="value" value={form.value} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Type:
        <select className="form-input" name="type" value={form.type} onChange={handleChange} required>
          {Object.values(WORD_PART_TYPE)
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </label>
      <label className="form-label">
        Definition:
        <textarea
          className="form-textarea"
          name="definition"
          value={form.definition}
          onChange={handleChange}
          rows={4}
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

export default WordPartForm;
