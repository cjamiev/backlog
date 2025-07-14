import React from 'react';
import { type Project } from '../../../model/library';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onClone, onDelete }) => {
  return (
    <div className="card-wrapper">
      <div className="card-header">
        <h2 className="card-title">{project.name}</h2>
      </div>
      <div>
        <span className="card-label">Rank:</span> <span className="card-text">{project.rank}</span>
      </div>
      <div>
        <span className="card-label">Details:</span> <span className="card-text">{project.details}</span>
      </div>
      <a
        className="url-link"
        href={`https://www.google.com/search?q=${encodeURIComponent(project.name + ' project')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google
      </a>
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

export default ProjectCard;
