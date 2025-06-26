import React, { useState, useEffect } from 'react';
import './ArtifactView.css';
import { Artifact, artifactService } from '../../services/artifactService';
import { motion } from 'framer-motion';
import EditArtifactModal from './EditArtifactModal';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface ArtifactViewProps {
  artifact: Artifact;
  onDelete?: () => void;
  onUpdate?: (updatedArtifact: Artifact) => void;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ artifact, onDelete, onUpdate }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await artifactService.deleteArtifact(artifact.id);
      toast.success('Artifact deleted successfully');
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting artifact:', error);
      toast.error('Failed to delete artifact');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdate = (updatedArtifact: Artifact) => {
    if (onUpdate) onUpdate(updatedArtifact);
  };

  const hasDimensions = artifact.height || artifact.width || artifact.length;
  const hasPhysicalDetails = hasDimensions || artifact.weight || artifact.material;

  return (
    <>
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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="artifact-hero-content"
          >
            <div className="artifact-metadata">
              {artifact.period && <span className="period">{artifact.period}</span>}
              {artifact.type && <span className="type">{artifact.type}</span>}
            </div>
            <div className="artifact-title-container">
              <h1>{artifact.name}</h1>
              <div className="artifact-actions">
                <button 
                  className="button secondary"
                  onClick={() => setIsEditModalOpen(true)}
                  title="Edit artifact"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="button secondary delete"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                  title="Delete artifact"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </motion.div>
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
                    <div className="info-group">
                      <label>Storage Location</label>
                      <span>{artifact.storageLocation}</span>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <EditArtifactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        artifact={artifact}
        onArtifactUpdated={handleUpdate}
      />

      
    </>
  );
};

export default ArtifactView; 