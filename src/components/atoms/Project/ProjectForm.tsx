import React, { useState, useEffect } from 'react';
import { DefaultProject, type Project } from '../../../model/library';

interface ProjectFormProps {
  onSubmit: (form: Project) => void;
  initialValues?: Project;
  isEditing: boolean;
  cancelEdit: () => void;
}

function ProjectForm({ onSubmit, initialValues, isEditing, cancelEdit }: ProjectFormProps) {
  const [form, setForm] = useState<Project>(DefaultProject);

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
    setForm(DefaultProject);
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Project Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Details:
        <textarea
          className="form-textarea"
          name="details"
          value={form.details}
          onChange={handleChange}
          rows={4}
          required
        />
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

export default ProjectForm;
