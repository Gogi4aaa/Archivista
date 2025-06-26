import React, { useRef, useEffect } from 'react';
import { Artifact } from '../../services/artifactService';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ArtifactView.css';

interface DeleteArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  artifact: Artifact;
  isDeleting: boolean;
}

const DeleteArtifactModal: React.FC<DeleteArtifactModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  artifact,
  isDeleting
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <motion.div
        className="modal-content"
        ref={modalRef}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h2 id="delete-modal-title">Delete Artifact</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
            disabled={isDeleting}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '16px',
            background: 'rgba(255, 87, 87, 0.1)',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <FaExclamationTriangle style={{ color: 'rgb(255, 87, 87)', fontSize: '24px' }} />
            <div>
              <h3 style={{ 
                margin: '0 0 8px 0',
                color: 'rgb(255, 87, 87)',
                fontSize: '1.1rem'
              }}>
                Warning
              </h3>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                You are about to delete <strong>{artifact.name}</strong>. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button secondary"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            className="button"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-label="Confirm deletion"
            style={{
              background: 'rgb(255, 87, 87)',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Artifact'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteArtifactModal; 