import React, { useState } from 'react';
import { Artifact } from '../../types/Artifact';
import ArtifactView from '../artifact/ArtifactView';
import '../artifact/ArtifactView.css';
import './Documents.css';

// Example artifact data
const exampleArtifact: Artifact = {
  id: '1',
  title: 'Ancient Ceramic Vase',
  description: 'A well-preserved ceramic vase from the late Bronze Age, featuring intricate geometric patterns and ritual scenes.',
  dateFound: '2023-06-15',
  period: 'Late Bronze Age',
  location: {
    site: 'Mycenae, Greece',
    coordinates: {
      latitude: 37.7316,
      longitude: 22.7556
    }
  },
  dimensions: {
    height: 45,
    width: 30,
    depth: 30,
    unit: 'cm'
  },
  weight: {
    value: 2.5,
    unit: 'kg'
  },
  material: ['Ceramic', 'Clay', 'Natural pigments'],
  condition: 'Good',
  conservation: {
    status: 'Completed',
    notes: 'Minor restoration work done on the rim. Stabilization of pigments completed.',
    lastChecked: '2024-01-15'
  },
  storage: {
    location: 'Wing A',
    container: 'Cabinet 15',
    position: 'Shelf 3'
  },
  images: [
    {
      url: 'https://example.com/vase-main.jpg',
      type: 'primary',
      caption: 'Full view of the vase'
    },
    {
      url: 'https://example.com/vase-detail1.jpg',
      type: 'detail',
      caption: 'Detail of geometric patterns'
    }
  ],
  category: ['Pottery', 'Ritual Objects', 'Domestic Items'],
  tags: ['Bronze Age', 'Ceramic', 'Geometric Style', 'Well-preserved'],
  status: 'PUBLISHED',
  featured: true,
  metadata: {
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2024-01-15T14:22:00Z',
    createdBy: 'Dr. Sarah Johnson',
    lastModifiedBy: 'John Smith'
  }
};

const Documents = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  // For demo purposes, we'll create an array of artifacts
  const artifacts = Array(6).fill(null).map((_, index) => ({
    ...exampleArtifact,
    id: String(index + 1),
    title: `${exampleArtifact.title} ${index + 1}`,
    featured: index % 3 === 0
  }));

  if (viewMode === 'detail' && selectedArtifact) {
    return (
      <div className="content">
        <div className="actions-container">
          <button 
            className="button secondary"
            onClick={() => {
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
      <div className="actions-container">
        <button className="button">Add New</button>
        <button className="button secondary">Sort by Date</button>
        <button className="button secondary">Sort by Type</button>
      </div>
      
      <div className="artifacts-grid">
        {artifacts.map(artifact => (
          <div 
            key={artifact.id} 
            className="artifact-card"
            onClick={() => {
              setSelectedArtifact(artifact);
              setViewMode('detail');
            }}
          >
            <div className="artifact-card-image">
              {artifact.images[0] && (
                <img 
                  src={artifact.images[0].url} 
                  alt={artifact.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              )}
            </div>
            <div className="artifact-card-content">
              <h3>{artifact.title}</h3>
              <div className="artifact-card-metadata">
                <span className="period">{artifact.period}</span>
                <span className="status">{artifact.status}</span>
              </div>
              <p className="artifact-card-description">{artifact.description.slice(0, 100)}...</p>
            </div>
            <div className="artifact-card-footer">
              <div className="artifact-card-tags">
                {artifact.category.slice(0, 2).map((cat, index) => (
                  <span key={index} className="category-badge">{cat}</span>
                ))}
              </div>
              {artifact.featured && <span className="featured">Featured</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents; 