import React from 'react';
import { Artifact } from '../../types/Artifact';

interface ArtifactViewProps {
  artifact: Artifact;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact }) => {
  const primaryImage = artifact.images.find(img => img.type === 'primary');

  return (
    <div className="artifact-view">
      <div className="artifact-header">
        <div className="artifact-title-section">
          <h1>{artifact.title}</h1>
          <div className="artifact-metadata">
            <span className="period">{artifact.period}</span>
            <span className="status">{artifact.status}</span>
            {artifact.featured && <span className="featured">Featured</span>}
          </div>
        </div>
      </div>

      <div className="artifact-content">
        <div className="artifact-main">
          <div className="artifact-image-section">
            {primaryImage && (
              <img 
                src={primaryImage.url} 
                alt={primaryImage.caption || artifact.title}
                className="primary-image" 
              />
            )}
            <div className="image-gallery">
              {artifact.images
                .filter(img => img.type !== 'primary')
                .map((img, index) => (
                  <img 
                    key={index}
                    src={img.url}
                    alt={img.caption || `${artifact.title} detail ${index + 1}`}
                    className="gallery-image"
                  />
                ))}
            </div>
          </div>

          <div className="artifact-details">
            <section className="description">
              <h2>Description</h2>
              <p>{artifact.description}</p>
            </section>

            <section className="physical-details">
              <h2>Physical Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Dimensions</label>
                  <span>{`${artifact.dimensions.height}×${artifact.dimensions.width}×${artifact.dimensions.depth} ${artifact.dimensions.unit}`}</span>
                </div>
                <div className="detail-item">
                  <label>Weight</label>
                  <span>{`${artifact.weight.value} ${artifact.weight.unit}`}</span>
                </div>
                <div className="detail-item">
                  <label>Material</label>
                  <span>{artifact.material.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <label>Condition</label>
                  <span>{artifact.condition}</span>
                </div>
              </div>
            </section>

            <section className="conservation">
              <h2>Conservation</h2>
              <div className="conservation-status">
                <span className={`status-badge ${artifact.conservation.status.toLowerCase().replace(' ', '-')}`}>
                  {artifact.conservation.status}
                </span>
                {artifact.conservation.lastChecked && (
                  <span className="last-checked">
                    Last checked: {new Date(artifact.conservation.lastChecked).toLocaleDateString()}
                  </span>
                )}
              </div>
              {artifact.conservation.notes && (
                <p className="conservation-notes">{artifact.conservation.notes}</p>
              )}
            </section>
          </div>
        </div>

        <div className="artifact-sidebar">
          <section className="location-info">
            <h3>Location</h3>
            <div className="info-group">
              <label>Found at</label>
              <span>{artifact.location.site}</span>
              {artifact.location.coordinates && (
                <div className="coordinates">
                  <span>{artifact.location.coordinates.latitude}, </span>
                  <span>{artifact.location.coordinates.longitude}</span>
                </div>
              )}
            </div>
          </section>

          <section className="storage-info">
            <h3>Storage</h3>
            <div className="info-group">
              <label>Location</label>
              <span>{artifact.storage.location}</span>
            </div>
            <div className="info-group">
              <label>Container</label>
              <span>{artifact.storage.container}</span>
            </div>
            <div className="info-group">
              <label>Position</label>
              <span>{artifact.storage.position}</span>
            </div>
          </section>

          <section className="categories-tags">
            <h3>Categories</h3>
            <div className="categories-list">
              {artifact.category.map((cat, index) => (
                <span key={index} className="category-badge">{cat}</span>
              ))}
            </div>
            <h3>Tags</h3>
            <div className="tags-list">
              {artifact.tags.map((tag, index) => (
                <span key={index} className="tag-badge">{tag}</span>
              ))}
            </div>
          </section>

          <section className="metadata-info">
            <h3>Metadata</h3>
            <div className="info-group">
              <label>Created</label>
              <span>{new Date(artifact.metadata.createdAt).toLocaleDateString()}</span>
              <span className="by-user">by {artifact.metadata.createdBy}</span>
            </div>
            <div className="info-group">
              <label>Last Modified</label>
              <span>{new Date(artifact.metadata.updatedAt).toLocaleDateString()}</span>
              <span className="by-user">by {artifact.metadata.lastModifiedBy}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArtifactView; 