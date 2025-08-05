import React from 'react';
import { type Project } from '../../../model/tracker';
import { getRankStars } from '../../../utils/contentMapper';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onHandleClickTag: (tag: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onHandleClickTag }) => {
  return (
    <div className="card-wrapper card-with-details-wrapper">
      <div className="card-header">
        <h2 className="card-title">{project.name}</h2>
      </div>
      <div className='card-body-with-details'>
        <div>
          <span className="card-label">Rank:</span> <span className="card-text">{getRankStars(project.rank)}</span>
        </div>
        <div>
          {project.tags.length ? (
            <div className="tags-container">
              <span className="card-label">Tags:</span>
              {project.tags.split(',').map((tag, i) => (
                <button key={i} className="tag-btn" onClick={() => onHandleClickTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <span className="card-label">Details:</span>
        <pre className='card-details'>
          {project.details}
        </pre>
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

export default ProjectCard;
