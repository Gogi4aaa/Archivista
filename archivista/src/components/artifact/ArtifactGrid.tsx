import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artifact } from '../../types/Artifact';
import './ArtifactGrid.css';

interface ArtifactGridProps {
  artifacts: Artifact[];
  onArtifactClick: (artifact: Artifact) => void;
}

const ArtifactGrid: React.FC<ArtifactGridProps> = ({ artifacts, onArtifactClick }) => {
  const [filters, setFilters] = useState({
    period: '',
    type: '',
    searchQuery: '',
  });

  const [filteredArtifacts, setFilteredArtifacts] = useState(artifacts);

  // Get unique periods and types for filter options
  const periods = Array.from(new Set(artifacts.map(a => a.period))).filter(Boolean);
  const types = Array.from(new Set(artifacts.map(a => a.type))).filter(Boolean);

  useEffect(() => {
    const filtered = artifacts.filter(artifact => {
      const matchesPeriod = !filters.period || artifact.period === filters.period;
      const matchesType = !filters.type || artifact.type === filters.type;
      const matchesSearch = !filters.searchQuery || 
        artifact.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        artifact.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesPeriod && matchesType && matchesSearch;
    });

    setFilteredArtifacts(filtered);
  }, [artifacts, filters]);

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
                  src={artifact.imageUrl || '/noimage.png'} 
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
                {artifact.description && (
                  <p className="description">{artifact.description.slice(0, 120)}...</p>
                )}
                <div className="artifact-card-footer">
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ArtifactGrid; 