import React from 'react';
import { type Song } from '../../../model/entertainment';
import { getRankStars } from '../../../utils/contentMapper';

interface SongCardProps {
  song: Song;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onEdit, onClone, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{song.name}</h2>
      </div>
      <div className='card-body card-body__sm'>
        <div>
          <span className="card-label">Band:</span> <span className="card-text">{song.band}</span>
        </div>
        <div>
          <span className="card-label">Rank:</span> <span className="card-text">{getRankStars(song.rank)}</span>
        </div>
        <div>
          <span className="card-label">Link:</span>{' '}
          {song.link ? (
            <a href={song.link} target="_blank" rel="noopener noreferrer" className="url-link">
              Open
            </a>
          ) : null}
        </div>
        <div>
          {song.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {song.tags.split(',').map((tag, i) => (
                <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className='link-wrapper'>
          <a
            className="url-link"
            href={`https://www.google.com/search?q=${encodeURIComponent(song.name + ' ' + song.band)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google
          </a>
          {!song.link && <a
            className="url-link"
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.name + ' ' + song.band + ' song')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube
          </a>}
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

export default SongCard;
