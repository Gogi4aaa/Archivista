import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ArtifactGrid from '../artifact/ArtifactGrid';
import ArtifactView from '../artifact/ArtifactView';
import AddArtifactModal from '../artifact/AddArtifactModal';
import { Artifact } from '../../types/Artifact';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { authService } from '../../services/authService';
import { artifactService } from '../../services/artifactService';

const Artifacts: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const token = authService.getToken();
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/artifact`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      toast.error('Failed to fetch artifacts');
    } finally {
      setIsLoading(false);
    }
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
  };

  // Cleanup image URLs when component unmounts or artifact changes
  useEffect(() => {
    return () => {
      if (selectedArtifact?.loadedImageUrl) {
        URL.revokeObjectURL(selectedArtifact.loadedImageUrl);
      }
    };
  }, [selectedArtifact]);

  const handleArtifactCreated = (newArtifact: Artifact) => {
    setArtifacts(prev => [newArtifact, ...prev]);
    setIsModalOpen(false);
    toast.success('Artifact created successfully!');
  };

  if (isLoading) {
    return (
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="content">
      {selectedArtifact ? (
        <>
          <button
            className="button secondary"
            style={{ margin: '20px' }}
            onClick={() => setSelectedArtifact(null)}
          >
            ← Back to Grid
          </button>
          <ArtifactView artifact={selectedArtifact} />
        </>
      ) : (
        <div style={{ width: '100%' }}>
          <div className="toolbar">
            <div className="toolbar-main">
              <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0 }}>Artifacts</h1>
              {user?.role === 'admin' && (
                <button 
                  className="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="button-icon">+</span>
                  Add New Artifact
                </button>
              )}
            </div>
          </div>

          <ArtifactGrid 
            artifacts={artifacts} 
            onArtifactClick={handleArtifactClick}
          />
        </div>
      )}

      <AddArtifactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onArtifactCreated={handleArtifactCreated}
      />
    </div>
  );
};

export default Artifacts; 