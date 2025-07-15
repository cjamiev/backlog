import React, { useState, useEffect } from 'react';
import { DefaultName, type Name, GENDER_TYPE } from '../../../model/library';

interface NameFormProps {
  onSubmit: (form: Name) => void;
  initialValues?: Name;
  isEditing: boolean;
  cancelEdit: () => void;
}

function NameForm({ onSubmit, initialValues, isEditing, cancelEdit }: NameFormProps) {
  const [form, setForm] = useState<Name>(DefaultName);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(DefaultName);
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Name:
        <input className="form-input" type="text" name="value" value={form.value} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Gender:
        <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
          <option value={GENDER_TYPE.MALE}>Male</option>
          <option value={GENDER_TYPE.FEMALE}>Female</option>
          <option value={GENDER_TYPE.OTHER}>Other</option>
        </select>
      </label>
      <label className="form-label">
        Origin:
        <input className="form-input" type="text" name="origin" value={form.origin} onChange={handleChange} required />
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

export default NameForm;
