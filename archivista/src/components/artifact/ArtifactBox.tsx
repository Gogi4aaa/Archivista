import React, { useEffect, useState } from 'react';
import { Artifact, artifactService } from '../../services/artifactService';
import './ArtifactView.css';

interface ArtifactBoxProps {
  artifact: Artifact;
  onClick: (artifact: Artifact) => void;
}

const ArtifactBox: React.FC<ArtifactBoxProps> = ({ artifact, onClick }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (artifact.id && artifact.imageUrl) {
      // Extract the ID from the imageUrl
      const id = artifact.id;
      artifactService.getArtifactImage(id)
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .catch(error => {
          console.error('Error loading image:', error);
          setImageUrl(null);
        });
    }
  }, [artifact]);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div 
      className="artifact-card"
      onClick={() => onClick(artifact)}
    >
      <div className="artifact-card-image">
        <img 
          src={imageUrl || '/noimage.png'} 
          alt={artifact.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/noimage.png';
          }}
        />
      </div>
      <div className="artifact-card-content">
        <h3>{artifact.name}</h3>
        <div className="artifact-card-metadata">
          <span className="period">{artifact.period}</span>
          <span className="status">{artifact.type}</span>
        </div>
        <p className="artifact-card-description">{artifact.description?.slice(0, 100)}...</p>
      </div>
      <div className="artifact-card-footer">
        <div className="artifact-card-tags">
          {artifact.type && (
            <span className="category-badge">{artifact.type}</span>
          )}
          {artifact.material && (
            <span className="category-badge">{artifact.material}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactBox; 