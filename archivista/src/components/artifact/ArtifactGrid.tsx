import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artifact } from '../../types/Artifact';
import { artifactService } from '../../services/artifactService';
import './ArtifactGrid.css';

interface ArtifactGridProps {
  artifacts: Artifact[];
  onArtifactClick: (artifact: Artifact) => void;
}

interface ArtifactWithLoadedImage extends Artifact {
  loadedImageUrl?: string;
}

const ArtifactGrid: React.FC<ArtifactGridProps> = ({ artifacts, onArtifactClick }) => {
  const [loadedArtifacts, setLoadedArtifacts] = useState<ArtifactWithLoadedImage[]>([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    period: '',
    type: ''
  });

  // Load images for artifacts
  useEffect(() => {
    const loadImages = async () => {
      const artifactsWithImages = await Promise.all(
        artifacts.map(async (artifact) => {
          if (artifact.id && artifact.imageUrl) {
            try {
              const imageBlob = await artifactService.getArtifactImage(artifact.id);
              const imageUrl = URL.createObjectURL(imageBlob);
              return { ...artifact, loadedImageUrl: imageUrl };
            } catch (error) {
              console.error('Error loading image:', error);
              return artifact;
            }
          }
          return artifact;
        })
      );
      setLoadedArtifacts(artifactsWithImages);
    };

    loadImages();

    // Cleanup URLs when component unmounts or artifacts change
    return () => {
      loadedArtifacts.forEach(artifact => {
        if (artifact.loadedImageUrl) {
          URL.revokeObjectURL(artifact.loadedImageUrl);
        }
      });
    };
  }, [artifacts]);

  // Extract unique periods and types for filters
  const periods = Array.from(new Set(artifacts.map(a => a.period).filter(Boolean)));
  const types = Array.from(new Set(artifacts.map(a => a.type).filter(Boolean)));

  // Filter artifacts based on search and filters
  const filteredArtifacts = loadedArtifacts.filter(artifact => {
    const matchesSearch = !filters.searchQuery || 
      artifact.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      artifact.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesPeriod = !filters.period || artifact.period === filters.period;
    const matchesType = !filters.type || artifact.type === filters.type;

    return matchesSearch && matchesPeriod && matchesType;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="artifact-grid-container">
      <div className="artifact-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search artifacts..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>
        <div className="filter-options">
          <select
            value={filters.period}
            onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
          >
            <option value="">All Periods</option>
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div 
        className="artifact-grid"
        layout
      >
        <AnimatePresence>
          {filteredArtifacts.map(artifact => (
            <motion.div
              key={artifact.id}
              className="artifact-card"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => onArtifactClick(artifact)}
            >
              <div className="artifact-card-image">
                <img 
                  src={artifact.loadedImageUrl || '/noimage.png'} 
                  alt={artifact.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/noimage.png';
                  }}
                />
                {(artifact.period || artifact.type) && (
                  <div className="artifact-card-badges">
                    {artifact.period && <span className="badge period">{artifact.period}</span>}
                    {artifact.type && <span className="badge type">{artifact.type}</span>}
                  </div>
                )}
              </div>
              <div className="artifact-card-content">
                <h3>{artifact.name}</h3>
                <div className="artifact-card-metadata">
                  <span className="period">{artifact.period}</span>
                  <span className="status">{artifact.type}</span>
                </div>
                <p className="artifact-card-description">
                  {artifact.description?.slice(0, 100)}
                  {artifact.description && artifact.description.length > 100 ? '...' : ''}
                </p>
              </div>
              <div className="artifact-card-footer">
                <div className="artifact-card-tags">
                  {artifact.type && (
                    <span className="category-badge">{artifact.type}</span>
                  )}
                  {artifact.material && (
                    <span className="category-badge">{artifact.material}</span>
                  )}
                </div>
                <div className="location">
                  {artifact.discoveryLocation && (
                    <span title="Discovery Location">📍 {artifact.discoveryLocation}</span>
                  )}
                </div>
                <div className="date">
                  {artifact.discoveryDate && (
                    <span title="Discovery Date">📅 {formatDate(artifact.discoveryDate)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ArtifactGrid; 