import React from 'react';
import { type Game } from '../../../model/entertainment';
import { getRankStars } from '../../../utils/contentMapper';

interface GameCardProps {
  game: Game;
  onEdit: () => void;

  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onEdit, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{game.name}</h2>
      </div>
      <div className='card-body card-body__sm'>
        <div>
          <span className="card-label">Rank:</span> <span className="card-text">{getRankStars(game.rank)}</span>
        </div>
        <div>
          <span className="card-label">Price:</span> <span className="card-text">{game.price}</span>
        </div>
        <div>
          {game.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {game.tags.split(',').map((tag: string, i: number) => (
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
            href={`https://www.google.com/search?q=${encodeURIComponent(game.name + ' game')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google
          </a>
          <a
            className="url-link"
            href={`https://steamdb.info/search/?a=all&q=${encodeURIComponent(game.name)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Steam
          </a>
          <a
            className="url-link"
            href={`https://howlongtobeat.com/?q=${encodeURIComponent(game.name)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            How Long
          </a>
          <a
            className="url-link"
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(game.name + ' game')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube
          </a>
        </div>
      </div>
      <div className="card-footer">
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

export default GameCard;
