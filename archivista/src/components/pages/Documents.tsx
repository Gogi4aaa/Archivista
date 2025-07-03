import React, { useState, useEffect, useMemo } from 'react';
import { Artifact, artifactService } from '../../services/artifactService';
import ArtifactView from '../artifact/ArtifactView';
import ArtifactBox from '../artifact/ArtifactBox';
import AddArtifactModal from '../artifact/AddArtifactModal';
import Pagination from '../common/Pagination';
import '../artifact/ArtifactView.css';
import './Documents.css';
import toast from 'react-hot-toast';

const Documents = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const fetchArtifacts = async () => {
    setIsLoading(true);
    try {
      const data = await artifactService.getAllArtifacts();
      setArtifacts(data);
    } catch (error) {
      toast.error('Failed to fetch artifacts');
      console.error('Error fetching artifacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  // Sort artifacts
  const sortedArtifacts = useMemo(() => {
    return [...artifacts].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return sortOrder === 'asc'
            ? (a.type || '').localeCompare(b.type || '')
            : (b.type || '').localeCompare(a.type || '');
        case 'title':
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [artifacts, sortBy, sortOrder]);

  // Calculate pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedArtifacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get current page artifacts
  const currentArtifacts = sortedArtifacts.slice(startIndex, endIndex);

  const handleSort = (type: 'date' | 'type' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handleArtifactCreated = (newArtifact: Artifact) => {
    setArtifacts(prev => [newArtifact, ...prev]);
    setIsModalOpen(false);
  };

  const handleArtifactClick = async (artifact: Artifact) => {
    if (artifact.id && artifact.imageUrl) {
      try {
        const imageBlob = await artifactService.getArtifactImage(artifact.id);
        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedArtifact({ ...artifact, loadedImageUrl: imageUrl });
      } catch (error) {
        console.error('Error loading image:', error);
        setSelectedArtifact(artifact);
      }
    } else {
      setSelectedArtifact(artifact);
    }
    setViewMode('detail');
  };

  useEffect(() => {
    // Cleanup image URLs when leaving detail view
    return () => {
      if (selectedArtifact?.loadedImageUrl) {
        URL.revokeObjectURL(selectedArtifact.loadedImageUrl);
      }
    };
  }, [selectedArtifact]);

  if (viewMode === 'detail' && selectedArtifact) {
    return (
      <div className="content">
        <div className="actions-container">
          <button 
            className="button secondary"
            onClick={() => {
              if (selectedArtifact.loadedImageUrl) {
                URL.revokeObjectURL(selectedArtifact.loadedImageUrl);
              }
              setViewMode('grid');
              setSelectedArtifact(null);
            }}
          >
            ← Back to Grid
          </button>
        </div>
        <ArtifactView artifact={selectedArtifact} />
      </div>
    );
  }

  return (
    <div className="content">
      <div className="toolbar">
        <div className="toolbar-main">
          <button className="button" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
            <span className="button-icon">+</span>
            Add New Artifact
          </button>
          <div className="sort-controls">
            <button
              className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => handleSort('date')}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortBy === 'type' ? 'active' : ''}`}
              onClick={() => handleSort('type')}
            >
              Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
              onClick={() => handleSort('title')}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          <div className="artifacts-grid">
            {currentArtifacts.map((artifact) => (
              <ArtifactBox
                key={artifact.id}
                artifact={artifact}
                onClick={() => handleArtifactClick(artifact)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AddArtifactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onArtifactCreated={handleArtifactCreated}
      />
    </div>
  );
};

export default Documents; 