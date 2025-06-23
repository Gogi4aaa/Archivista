import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ArtifactGrid from '../artifact/ArtifactGrid';
import ArtifactView from '../artifact/ArtifactView';
import { Artifact } from '../../types/Artifact';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { authService } from '../../services/authService';
const Artifacts: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const token = authService.getToken();
      setIsLoading(true);
      // TODO: Replace with actual API call
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

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            padding: '0 24px'
          }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>Artifacts</h1>
            {user?.role === 'admin' && (
              <button 
                className="button"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {/* TODO: Implement add artifact */}}
              >
                <span>➕</span> Add New Artifact
              </button>
            )}
          </div>

          <ArtifactGrid 
            artifacts={artifacts} 
            onArtifactClick={handleArtifactClick}
          />
        </div>
      )}
    </div>
  );
};

export default Artifacts; 