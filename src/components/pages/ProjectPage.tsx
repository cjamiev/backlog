import React, { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import AddCard from '../atoms/AddCard';
import Search from '../atoms/Search';
import Modal from '../atoms/Modal';
import Sidepanel from '../atoms/Sidepanel';
import Footer from '../atoms/Footer';
import Pagination from '../atoms/Pagination';
import ProjectCard from '../atoms/Project/ProjectCard';
import ProjectForm from '../atoms/Project/ProjectForm';
import { DefaultProject, type Project } from '../../model/library';
import { fakeProjects } from '../../mocked/projects';
import { copyContents } from '../../utils/copyToClipboard';
import { getCSV, getJSON } from '../../utils/contentMapper';
import { useStorageContext } from '../../context/StorageContext';
import { getRecordsFromStorage } from '../../utils/storage';

const PROJECTS_PER_PAGE = 24;
const projectSearchByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'details', label: 'Details' }
];
const projectSortByOptions = [
  { value: 'name', label: 'Name' },
  { value: 'rank', label: 'Rank' }
];

const ProjectPage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorageContext();
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);

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
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = projects.filter((p: Project) => {
    if (searchBy === 'details') {
      return p.details.toLowerCase().includes(search.toLowerCase());
    } else {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.rank - b.rank;
    }
  });
  const totalPages = Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  useEffect(() => {
    if (isBackendAvailable && isLoadingProjects) {
      loadRecordsByType('projects').then((records: Project[]) => {
        setProjects(records);
        setIsLoadingProjects(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedProjects = getRecordsFromStorage('projects', [...fakeProjects]);
      setProjects(savedProjects);
      setIsLoadingProjects(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingProjects]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchBy, sortBy, projects.length]);

  const handleSubmit = async (payload: Project[]) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('projects', JSON.stringify(payload));
    } else {
      updateRecordsByType(JSON.stringify(payload), 'projects')
        .then((isSuccess: boolean) => {
          if (isSuccess) {
            setShowBanner({ show: true, type: 'success' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          } else {
            setShowBanner({ show: true, type: 'error' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          }
        })
        .catch((error: unknown) => {
          setShowBanner({ show: true, type: 'error' });
          setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          console.error('Error:', error);
        });
    }
  };

  const handleAddProject = (form: Project) => {
    const newProject = {
      id: String(projects.length + 1),
      name: form.name,
      details: form.details,
      rank: form.rank
    };
    setProjects((prev) => {
      const updatedProjects = [newProject, ...prev];
      handleSubmit(updatedProjects);
      return updatedProjects;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultProject);
    setSearch('');
  };

  const handleEditProject = (form: Project) => {
    setProjects((prev) => {
      const updatedProjects = prev.map((p) =>
        p.id === form.id
          ? {
            id: p.id,
            name: form.name,
            details: form.details,
            rank: form.rank
          }
          : p
      );

      handleSubmit(updatedProjects);
      return updatedProjects;
    });
    setIsPanelOpen(false);
    setIsAddMode(false);
    setIsEditing(false);
    setEditForm(DefaultProject);
  };

  const startEdit = (selectedProject: Project, isClone?: boolean) => {
    setEditForm({
      id: isClone ? String(projects.length + 1) : selectedProject.id,
      name: selectedProject.name,
      details: selectedProject.details,
      rank: selectedProject.rank
    });
    setIsEditing(!isClone);
    setIsAddMode(Boolean(isClone));
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
      setProjects((prev) => {
        const updatedProjects = prev.filter((p) => p.id !== projectToDelete.id);
        handleSubmit(updatedProjects);
        return updatedProjects;
      });
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const cancelDeleteProject = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleChangeSearchBy = (filter: string) => {
    setSearchBy(filter);
  };

  const handleChangeSortBy = (val: string) => setSortBy(val);

  const handleOpenCSVModal = () => setShowCSVModal(true);
  const handleCloseCSVModal = () => setShowCSVModal(false);
  const handleOpenJSONModal = () => setShowJSONModal(true);
  const handleCloseJSONModal = () => setShowJSONModal(false);

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
      <Banner isVisible={showBanner.show} type={showBanner.type} />
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
            {!search && currentPage === 1 ? <AddCard onClick={startAdd} /> : null}
            {paginatedProjects.map((project, idx) => (
              <ProjectCard
                key={idx}
                project={project}
                onEdit={() => {
                  startEdit(project);
                }}
                onClone={() => {
                  startEdit(project, true);
                }}
                onDelete={() => handleDeleteProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div>
      <Footer>
        <div>
          <button className="primary-btn" onClick={handleOpenCSVModal}>
            Show CSV
          </button>
          <button className="primary-btn" onClick={handleOpenJSONModal}>
            Show JSON
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
      <Sidepanel
        isOpen={isPanelOpen && (isAddMode || isEditing)}
        onClose={cancelEdit}
        title={isEditing ? 'Updating existing' : 'Add a New Project'}
      >
        <ProjectForm
          onSubmit={isEditing ? handleEditProject : handleAddProject}
          initialValues={editForm}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
        />
      </Sidepanel>
    </div>
  );
};

export default ProjectPage;
