import React, { useState } from 'react';
import './ArtifactView.css';
import { Artifact } from '../../types/Artifact';

interface ArtifactViewProps {
  artifact: Artifact;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="artifact-view">
      <div className="artifact-header">
        <div className="artifact-title-section">
          <h1>{artifact.name}</h1>
          <div className="artifact-metadata">
            {artifact.period && <span className="period">{artifact.period}</span>}
            {artifact.type && <span className="status">{artifact.type}</span>}
          </div>
        </div>
      </div>

      <div className="artifact-content">
        <div className="artifact-main">
          <div className="artifact-image-section">
            <img
              src={!imageError && (artifact.loadedImageUrl || artifact.imageUrl) ? artifact.loadedImageUrl || '/noimage.png' : '/noimage.png'}
              alt={artifact.name}
              className="primary-image"
              onError={() => setImageError(true)}
            />
          </div>

          <div className="artifact-details">
            <section className="description">
              <h2>Description</h2>
              <p>{artifact.description}</p>
            </section>

            <section className="physical-details">
              <h2>Physical Details</h2>
              <div className="details-grid">
                {(artifact.height || artifact.width || artifact.length) && (
                  <div className="detail-item">
                    <label>Dimensions</label>
                    <span>
                      {artifact.height && `H: ${artifact.height}`}
                      {artifact.width && ` W: ${artifact.width}`}
                      {artifact.length && ` L: ${artifact.length}`}
                    </span>
                  </div>
                )}
                {artifact.weight && (
                  <div className="detail-item">
                    <label>Weight</label>
                    <span>{artifact.weight}</span>
                  </div>
                )}
                {artifact.material && (
                  <div className="detail-item">
                    <label>Material</label>
                    <span>{artifact.material}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="artifact-sidebar">
          <section className="location-info">
            <h3>Discovery Details</h3>
            <div className="info-group">
              <label>Location</label>
              <span>{artifact.discoveryLocation}</span>
            </div>
            <div className="info-group">
              <label>Date Found</label>
              <span>{new Date(artifact.discoveryDate).toLocaleDateString()}</span>
            </div>
          </section>

          {artifact.storageLocation && (
            <section className="storage-info">
              <h3>Storage</h3>
              <div className="info-group">
                <label>Location</label>
                <span>{artifact.storageLocation}</span>
              </div>
            </section>
          )}

          <section className="metadata-info">
            <h3>Metadata</h3>
            <div className="info-group">
              <label>Created</label>
              <span>{new Date(artifact.createdAt).toLocaleDateString()}</span>
              <span className="by-user">by {artifact.creatorId}</span>
            </div>
            {artifact.updatedAt && (
              <div className="info-group">
                <label>Last Modified</label>
                <span>{new Date(artifact.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArtifactView; 