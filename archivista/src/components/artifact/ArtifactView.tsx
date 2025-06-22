import React, { useState, useEffect } from 'react';
import './ArtifactView.css';
import { Artifact } from '../../types/Artifact';
import { motion } from 'framer-motion';

interface ArtifactViewProps {
  artifact: Artifact;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Reset states when artifact changes
    setImageError(false);
    setIsImageLoaded(false);
  }, [artifact]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasDimensions = artifact.height || artifact.width || artifact.length;
  const hasPhysicalDetails = hasDimensions || artifact.weight || artifact.material;

  return (
    <motion.div 
      className="artifact-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="artifact-hero">
        <motion.div 
          className="artifact-image-container"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={!imageError && (artifact.loadedImageUrl || artifact.imageUrl) ? artifact.loadedImageUrl || '/noimage.png' : '/noimage.png'}
            alt={artifact.name}
            className={`primary-image ${isImageLoaded ? 'loaded' : ''}`}
            onError={() => setImageError(true)}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="image-overlay" />
        </motion.div>

        <div className="artifact-hero-content">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="artifact-metadata">
              {artifact.period && <span className="period">{artifact.period}</span>}
              {artifact.type && <span className="type">{artifact.type}</span>}
            </div>
            <h1>{artifact.name}</h1>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="artifact-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="content-wrapper">
          <div className="artifact-main">
            {artifact.description && (
              <motion.section 
                className="description"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="section-header">
                  <h2>About this Artifact</h2>
                </div>
                <div className="section-divider" />
                <p>{artifact.description}</p>
              </motion.section>
            )}

            {hasPhysicalDetails && (
              <motion.section 
                className="physical-details"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="section-header">
                  <h2>Physical Details</h2>
                </div>
                <div className="section-divider" />
                <div className="details-grid">
                  {hasDimensions && (
                    <div className="detail-card">
                      <div className="detail-icon">📏</div>
                      <div className="detail-content">
                        <label>Dimensions</label>
                        <span>
                          {artifact.height && `H: ${artifact.height}`}
                          {artifact.width && ` W: ${artifact.width}`}
                          {artifact.length && ` L: ${artifact.length}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {artifact.weight && (
                    <div className="detail-card">
                      <div className="detail-icon">⚖️</div>
                      <div className="detail-content">
                        <label>Weight</label>
                        <span>{artifact.weight}</span>
                      </div>
                    </div>
                  )}
                  {artifact.material && (
                    <div className="detail-card">
                      <div className="detail-icon">🔨</div>
                      <div className="detail-content">
                        <label>Material</label>
                        <span>{artifact.material}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          <motion.div 
            className="artifact-sidebar"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {(artifact.discoveryLocation || artifact.discoveryDate) && (
              <section className="discovery-info">
                <div className="section-header">
                  <h3>Discovery Details</h3>
                </div>
                <div className="section-divider" />
                <div className="info-card">
                  <div className="info-groups-container">
                    {artifact.discoveryLocation && (
                      <div className="info-group">
                        <label>Location</label>
                        <span>{artifact.discoveryLocation}</span>
                      </div>
                    )}
                    {artifact.discoveryDate && (
                      <div className="info-group">
                        <label>Date Found</label>
                        <span>{formatDate(artifact.discoveryDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {artifact.storageLocation && (
              <section className="storage-info">
                <div className="section-header">
                  <h3>Current Location</h3>
                </div>
                <div className="section-divider" />
                <div className="info-card">
                  <div className="info-groups-container">
                    <div className="info-group">
                      <label>Storage</label>
                      <span>{artifact.storageLocation}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="metadata-info">
              <div className="section-header">
                <h3>Record Details</h3>
              </div>
              <div className="section-divider" />
              <div className="info-card">
                <div className="info-groups-container">
                  <div className="info-group">
                    <label>Created</label>
                    <div className="metadata-value">
                      <span>{formatDate(artifact.createdAt)}</span>
                      {artifact.creatorId && (
                        <span className="by-user">by {artifact.creatorId}</span>
                      )}
                    </div>
                  </div>
                  {artifact.updatedAt && (
                    <div className="info-group">
                      <label>Last Modified</label>
                      <span>{formatDate(artifact.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArtifactView; 