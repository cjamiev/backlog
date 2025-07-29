import React, { useState, useEffect } from 'react';
import type { Contact } from '../../../model/library';

interface ContactFormProps {
  onSubmit: (form: Contact) => void;
  initialValues: Contact;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, initialValues, cancelEdit, allTags, isEditing }) => {
  const [form, setForm] = useState<Contact>(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        <input
          disabled={isEditing}
          className="form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>
      <label className="form-label">
        Phone:
        <input
          className="form-input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </label>
      <label className="form-label">
        Email:
        <input
          className="form-input"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>
      <label className="form-label">
        Address:
        <textarea
          className="form-input"
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={2}
        />
      </label>
      <label className="form-label">
        Tags (comma separated):
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="form-input"
        />
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
          Save
        </button>
        <button className="form-cancel-btn" type="button" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactForm; 