import React, { useState, useEffect } from 'react';
import { DefaultCountdown, type Countdown } from '../../../model/library';

interface CountdownFormProps {
  onSubmit: (form: Countdown) => void;
  initialValues?: Countdown;
  isEditing: boolean;
  cancelEdit: () => void;
}

function CountdownForm({ onSubmit, initialValues, isEditing, cancelEdit }: CountdownFormProps) {
  const [form, setForm] = useState<Countdown>(DefaultCountdown);

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
    setForm(DefaultCountdown);
  };

  const setQuickDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const dateString = date.toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, date: dateString }));
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <label className="form-label">
        Countdown Name:
        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="form-label">
        Target Date:
        <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} required />
      </label>
      <div className="quick-date-buttons">
        <div className="quick-date-title">Quick Set:</div>
        <div className="quick-date-container">
          <button type="button" className="quick-date-btn" onClick={() => setQuickDate(1)}>
            Tomorrow
          </button>
          <button type="button" className="quick-date-btn" onClick={() => setQuickDate(7)}>
            Next Week
          </button>
          <button type="button" className="quick-date-btn" onClick={() => setQuickDate(30)}>
            Next Month
          </button>
          <button type="button" className="quick-date-btn" onClick={() => setQuickDate(365)}>
            Next Year
          </button>
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

export default CountdownForm;
