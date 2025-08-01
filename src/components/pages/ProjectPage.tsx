import React, { useState, useEffect } from 'react';
import { useLoadRecordsByType, useUpdateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import ProjectCard from '../atoms/Project/ProjectCard';
import ProjectForm from '../atoms/Project/ProjectForm';
import { DefaultProject, type Project } from '../../model/library';
import { copyContents } from '../../utils/copyToClipboard';
import { capitalizeEachWord, checkIfDuplicateId, getCSV, getJSON } from '../../utils/contentMapper';
import { BANNER_MESSAGES } from '../../constants/messages';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';

const PROJECTS_PER_PAGE = 24;
const projectSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'details', label: 'Details' },
  { value: 'tags', label: 'Tags' },
];
const projectSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const ProjectPage: React.FC = () => {
  const { data: projects = [], isLoading: isLoadingProjects } = useLoadRecordsByType<Project>('projects');
  const { mutate, isSuccess, isError } = useUpdateRecordsByType();

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState<string>('name');

  const [editForm, setEditForm] = useState<Project>(DefaultProject);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string, message: string }>({ isVisible: false, type: 'success', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const filteredProjects = projects.filter((p: Project) => {
    if (searchBy === 'details') {
      return p.details.toLowerCase().includes(search.toLowerCase());
    } else if (searchBy === 'tags') {
      return p.tags.toLowerCase().includes(search.toLowerCase());
    } else {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.rank - a.rank;
    }
  });
  const totalPages = Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const allTags = Array.from(
    new Set(
      projects.flatMap((project) =>
        project.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, projects.length]);

  useEffect(() => {
    if (isSuccess) {
      setShowBanner({ isVisible: true, type: 'success', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.SAVE_SUCCESS });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  }, [isError]);

  const handleSubmit = async (payload: Project[]) => {
    mutate({ payload: JSON.stringify(payload), type: 'projects' });
  };

  const handleAddProject = (form: Project) => {
    const newProject = {
      ...form,
      name: capitalizeEachWord(form.name),
    };

    const isThereADuplicate = checkIfDuplicateId(projects.map(i => i.name), newProject.name);
    if (!isThereADuplicate) {
      const updatedProjects = [newProject, ...projects];
      handleSubmit(updatedProjects);
      setIsPanelOpen(false);
      setIsAddMode(false);
      setIsEditing(false);
      setEditForm(DefaultProject);
      setSearch('');
    } else {
      setShowBanner({ isVisible: true, type: 'error', message: BANNER_MESSAGES.DUPLICATE_ID });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }
  };

  const handleEditProject = (form: Project) => {
    const updatedProjects = projects.map((p) =>
      p.name === form.name
        ? form
        : p
    );
    handleSubmit(updatedProjects);
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultProject);
  };

  const startEdit = (selectedProject: Project) => {
    setEditForm(selectedProject);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const startAdd = () => {
    setEditForm(DefaultProject);
    setIsEditing(false);
    setIsAddMode(true);
    setIsPanelOpen(true);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultProject);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      const updatedProjects = projects.filter((p) => p.name !== projectToDelete.name);
      handleSubmit(updatedProjects);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const cancelDeleteProject = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleClickTag = (tag: string) => {
    setSearchBy('tags');
    setSearch(tag);
  };

  const handleChangeSearchBy = (filter: string) => {
    setSearchBy(filter);
  };

  const handleChangeSortBy = (val: string) => setSortBy(val);

  const handleOpenCSVModal = () => setShowCSVModal(true);
  const handleCloseCSVModal = () => setShowCSVModal(false);
  const handleOpenJSONModal = () => setShowJSONModal(true);
  const handleCloseJSONModal = () => setShowJSONModal(false);
  const handleOpenTagsModal = () => setShowTagsModal(true);
  const handleCloseTagsModal = () => setShowTagsModal(false);
  const handleSelectTagFromModal = (tag: string) => {
    setSearchBy('tags');
    setSearch(tag);
    setShowTagsModal(false);
  };

  const handlePrevious = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handlePageSelect = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };
  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="page-wrapper">
      <Banner {...showBanner} />
      <h1 className="page-title">Projects</h1>
      <Search
        search={search}
        onSearchChange={setSearch}
        searchBy={searchBy}
        handleChangeSearchBy={handleChangeSearchBy}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
        searchByOptions={projectSearchByOptions}
        sortByOptions={projectSortByOptions}
      />
      <div className="page-body-layout">
        {!isLoadingProjects ? (
          <div className="cards-container">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                onEdit={() => {
                  startEdit(project);
                }}
                onDelete={() => handleDeleteProject(project)}
                onHandleClickTag={handleClickTag}
              />
            ))}
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div>
      <Footer>
        <div>
          <button className='primary-btn' onClick={startAdd}>Add Project</button>
          <button className="primary-btn" onClick={handleOpenCSVModal}>
            Show CSV
          </button>
          <button className="primary-btn" onClick={handleOpenJSONModal}>
            Show JSON
          </button>
          <button className="primary-btn" onClick={handleOpenTagsModal}>
            Select A Tag
          </button>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePrevious={handlePrevious}
          handlePageSelect={handlePageSelect}
          handleNext={handleNext}
        />
      </Footer>
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDeleteProject}
        title={projectToDelete ? `Are you sure you want to delete "${projectToDelete.name}"?` : 'Error missing project'}
      >
        <div className="modal-actions">
          <button className="form-submit" onClick={confirmDeleteProject}>
            Confirm
          </button>
          <button className="form-cancel-btn" onClick={cancelDeleteProject}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={showCSVModal} onClose={handleCloseCSVModal} title="CSV Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getCSV(projects))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getCSV(projects)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showJSONModal} onClose={handleCloseJSONModal} title="JSON Export">
        <div className="modal-data-display">
          <button onClick={() => copyContents(getJSON(projects))} className="modal-copy-btn">
            Copy
          </button>
          <pre className="modal-data-content">{getJSON(projects)}</pre>
        </div>
      </Modal>
      <Modal isOpen={showTagsModal} onClose={handleCloseTagsModal} title="All Tags">
        <div className="modal-data-display">
          <div className="tags-container">
            {allTags.length === 0 && <div>No tags available.</div>}
            {allTags.map((tag) => (
              <button
                key={tag}
                className="tag-btn"
                onClick={() => handleSelectTagFromModal(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Modal>
      <Sidepanel
        isWide
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Project'}
      >
        <ProjectForm
          onSubmit={isEditing ? handleEditProject : handleAddProject}
          initialValues={editForm}
          cancelEdit={cancelEdit}
          allTags={allTags}
          isEditing={isEditing}
        />
      </Sidepanel>
    </div>
  );
};

export default ProjectPage;
