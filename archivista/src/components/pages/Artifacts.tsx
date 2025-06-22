import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Artifact {
  id: string;
  name: string;
  description: string;
  category: string;
  period: string;
  location: string;
  dateAdded: string;
  imageUrl?: string;
}

const Artifacts: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/artifacts');
      const data = await response.json();
      setArtifacts(data);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      toast.error('Failed to fetch artifacts');
    } finally {
      setIsLoading(false);
    }
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
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Artifacts</h1>
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

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Period</th>
                <th>Location</th>
                <th>Date Added</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {artifacts.map(artifact => (
                <tr key={artifact.id}>
                  <td>{artifact.name}</td>
                  <td>{artifact.category}</td>
                  <td>{artifact.period}</td>
                  <td>{artifact.location}</td>
                  <td>{new Date(artifact.dateAdded).toLocaleDateString()}</td>
                  {user?.role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="button small"
                          style={{ padding: '6px' }}
                          onClick={() => {/* TODO: Implement edit */}}
                        >
                          ✏️
                        </button>
                        <button 
                          className="button small secondary"
                          style={{ padding: '6px' }}
                          onClick={() => {/* TODO: Implement delete */}}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Artifacts; 