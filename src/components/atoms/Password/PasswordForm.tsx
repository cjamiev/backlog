import React, { useState, useEffect } from 'react';
import { DefaultPassword, type Password } from '../../../model/library';

interface PasswordFormProps {
  onSubmit: (form: Password) => void;
  initialValues?: Password;
  isEditing: boolean;
  cancelEdit: () => void;
}

function PasswordForm({ onSubmit, initialValues, isEditing, cancelEdit }: PasswordFormProps) {
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
    // Set current date as updatedDate if not provided
    const formWithDate = {
      ...form,
      updatedDate: form.updatedDate || new Date().toISOString().split('T')[0]
    };
    onSubmit(formWithDate);
    setForm(DefaultPassword);
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

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Service/Website Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
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
        Updated Date:
        <input className="form-input" type="date" name="updatedDate" value={form.updatedDate} onChange={handleChange} />
      </label>
      <label className="form-label">
        Website Link (optional):
        <input
          className="form-input"
          type="url"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </label>
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

export default PasswordForm;
