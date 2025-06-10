import React, { useState } from 'react';
import './ArtifactView.css';

interface ArtifactViewProps {
  artifact: {
    Id: string;
    Name: string;
    Description?: string;
    DiscoveryDate: string;
    DiscoveryLocation: string;
    Period?: string;
    Type?: string;
    Material?: string;
    Weight?: number;
    Height?: number;
    Width?: number;
    Length?: number;
    StorageLocation?: string;
    CreatorId: string;
    CreatedAt: string;
    UpdatedAt?: string;
    ImageUrl?: string | null;
  };
}

const baseUrl = 'http://localhost:5075';

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="artifact-view">
      <div className="artifact-header">
        <div className="artifact-title-section">
          <h1>{artifact.Name}</h1>
          <div className="artifact-metadata">
            <span className="period">{artifact.Period}</span>
            <span className="status">{artifact.Type}</span>
          </div>
        </div>
      </div>

      <div className="artifact-content">
        <div className="artifact-main">
          <div className="artifact-image-section">
            <img
              src={!imageError && artifact.ImageUrl ? `${baseUrl}${artifact.ImageUrl}` : '/noimage.png'}
              alt={artifact.Name}
              className="primary-image"
              onError={() => setImageError(true)}
            />
          </div>

          <div className="artifact-details">
            <section className="description">
              <h2>Description</h2>
              <p>{artifact.Description}</p>
            </section>

            <section className="physical-details">
              <h2>Physical Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Dimensions</label>
                  <span>
                    H: {artifact.Height}, W: {artifact.Width}, L: {artifact.Length}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Weight</label>
                  <span>{artifact.Weight}</span>
                </div>
                <div className="detail-item">
                  <label>Material</label>
                  <span>{artifact.Material}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="artifact-sidebar">
          <section className="location-info">
            <h3>Discovery Details</h3>
            <div className="info-group">
              <label>Location</label>
              <span>{artifact.DiscoveryLocation}</span>
            </div>
            <div className="info-group">
              <label>Date Found</label>
              <span>{new Date(artifact.DiscoveryDate).toLocaleDateString()}</span>
            </div>
          </section>

          <section className="storage-info">
            <h3>Storage</h3>
            <div className="info-group">
              <label>Location</label>
              <span>{artifact.StorageLocation}</span>
            </div>
          </section>

          <section className="metadata-info">
            <h3>Metadata</h3>
            <div className="info-group">
              <label>Created</label>
              <span>{new Date(artifact.CreatedAt).toLocaleDateString()}</span>
              <span className="by-user">by {artifact.CreatorId}</span>
            </div>
            <div className="info-group">
              <label>Last Modified</label>
              <span>{artifact.UpdatedAt ? new Date(artifact.UpdatedAt).toLocaleDateString() : 'Never'}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArtifactView; 