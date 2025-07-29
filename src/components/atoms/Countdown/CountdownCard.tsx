import React, { useState, useEffect } from 'react';
import type { Countdown } from '../../../model/library';
import { Temporal } from "@js-temporal/polyfill";

interface CountdownCardProps {
  countdown: Countdown;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ countdown, onEdit, onClone, onDelete, onHandleClickTag }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(countdown.date).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      } else {
        setTimeLeft('Time is up!');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countdown.date]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return Temporal.PlainDate.from({ year: Number(year), month: Number(month), day: Number(day) }).toLocaleString();
  };

  const isOverdue = new Date(countdown.date).getTime() < new Date().getTime();

  return (
    <div className={`card-wrapper ${isOverdue ? 'overdue' : ''}`}>
      <div className="card-header">
        <h2 className="card-title">{countdown.name}</h2>
      </div>
      <div className='card-body'>
        <div>
          <span className="card-label">Target Date:</span>
          <span className="card-text"> {formatDate(countdown.date)}</span>
        </div>
        <div>
          <span className="card-label">Time Remaining: </span>
          <span className={`card-text ${isOverdue ? 'overdue-text' : 'countdown-text'}`}>{timeLeft}</span>
        </div>
        <div>
          {countdown.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {countdown.tags.split(',').map((tag, i) => (
                <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="card-footer">
        <button className="primary-btn" onClick={onClone}>
          Clone
        </button>
        <button className="primary-btn" onClick={onEdit}>
          Edit
        </button>
        <button className="negative-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CountdownCard;
