import React, { useState, useEffect } from 'react';
import { DefaultPassword, type Password } from '../../../model/password';

interface PasswordFormProps {
  onSubmit: (form: Password) => void;
  initialValues?: Password;
  cancelEdit: () => void;
  allTags: string[];
  isEditing: boolean;
}

function PasswordForm({ onSubmit, initialValues, cancelEdit, allTags, isEditing }: PasswordFormProps) {
  const [form, setForm] = useState<Password>(DefaultPassword);
  const [showPassword, setShowPassword] = useState(false);

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

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setForm((prev) => ({ ...prev, password }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        Service/Website Name:
        <input disabled={isEditing} className="form-input" type="text" name="id" value={form.id} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Username/Email:
        <input
          className="form-input"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </label>
      <label className="form-label">
        Password:
        <div className="password-input-group">
          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
          <button type="button" className="generate-btn" onClick={generatePassword} title="Generate secure password">
            🔐
          </button>
          {form.password && (
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyToClipboard(form.password)}
              title="Copy password"
            >
              📋
            </button>
          )}
        </div>
      </label>
      <label className="form-label">
        Website Link (optional):
        <input
          className="form-input"
          type="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://example.com"
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

export default PasswordForm;
