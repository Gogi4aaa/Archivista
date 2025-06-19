import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Artifact, CreateArtifactDto, artifactService } from '../../services/artifactService';
import ArtifactView from '../artifact/ArtifactView';
import ArtifactBox from '../artifact/ArtifactBox';
import AddArtifactModal from '../artifact/AddArtifactModal';
import Pagination from '../common/Pagination';
import '../artifact/ArtifactView.css';
import './Documents.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { log } from 'console';

const baseUrl = 'http://localhost:5075';

interface FormErrors {
  [key: string]: string;
}

const Documents = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CreateArtifactDto>({
    Name: '',
    Description: '',
    DiscoveryLocation: '',
    Period: '',
    Type: 'Artifact',
    Material: '',
    image: undefined
  });

  const fetchArtifacts = async () => {
    setIsLoading(true);
    try {
      const data = await artifactService.getAllArtifacts();
      console.log("DATA",data);
      setArtifacts(data);
    } catch (error) {
      toast.error('Failed to fetch artifacts');
      console.error('Error fetching artifacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  // Sort artifacts
  const sortedArtifacts = useMemo(() => {
    return [...artifacts].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return sortOrder === 'asc'
            ? (a.type || '').localeCompare(b.type || '')
            : (b.type || '').localeCompare(a.type || '');
        case 'title':
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [artifacts, sortBy, sortOrder]);

  // Calculate pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedArtifacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get current page artifacts
  const currentArtifacts = sortedArtifacts.slice(startIndex, endIndex);

  const handleSort = (type: 'date' | 'type' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImagePicker = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Title is required';
    }
    
    if (!formData.DiscoveryLocation.trim()) {
      newErrors.DiscoveryLocation = 'Location is required';
    }
    
    if (formData.Type && !formData.Type.trim()) {
      newErrors.Type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      DiscoveryLocation: '',
      Period: '',
      Type: 'Artifact',
      Material: '',
      image: undefined
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newArtifact = await artifactService.createArtifact({
        ...formData,
        Type: formData.Type || 'Artifact'  // Provide default value
      });
      
      setArtifacts(prev => [newArtifact, ...prev]);
      setIsFormOpen(false);
      resetForm();
      toast.success('Artifact created successfully!');
    } catch (error) {
      toast.error('Failed to create artifact');
      console.error('Error creating artifact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArtifactCreated = (newArtifact: Artifact) => {
    setArtifacts(prev => [newArtifact, ...prev]);
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
    setViewMode('detail');
  };

  useEffect(() => {
    // Cleanup image URLs when leaving detail view
    return () => {
      if (selectedArtifact?.loadedImageUrl) {
        URL.revokeObjectURL(selectedArtifact.loadedImageUrl);
      }
    };
  }, [selectedArtifact]);

  if (viewMode === 'detail' && selectedArtifact) {
    return (
      <div className="content">
        <div className="actions-container">
          <button 
            className="button secondary"
            onClick={() => {
              if (selectedArtifact.loadedImageUrl) {
                URL.revokeObjectURL(selectedArtifact.loadedImageUrl);
              }
              setViewMode('grid');
              setSelectedArtifact(null);
            }}
          >
            ← Back to Grid
          </button>
        </div>
        <ArtifactView artifact={selectedArtifact} />
      </div>
    );
  }

  return (
    <div className="content">
      <div className="toolbar">
        <div className="toolbar-main">
          <button className="button" onClick={() => setIsFormOpen(true)} disabled={isLoading}>
            <span className="button-icon">+</span>
            Add New Artifact
          </button>
          <div className="toolbar-divider" />
          <div className="sort-buttons">
            <button 
              className={`button secondary ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => handleSort('date')}
              disabled={isLoading}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`button secondary ${sortBy === 'type' ? 'active' : ''}`}
              onClick={() => handleSort('type')}
              disabled={isLoading}
            >
              Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`button secondary ${sortBy === 'title' ? 'active' : ''}`}
              onClick={() => handleSort('title')}
              disabled={isLoading}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
        <div className="toolbar-meta">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedArtifacts.length)} of {sortedArtifacts.length} artifacts
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading artifacts...</p>
        </div>
      ) : sortedArtifacts.length === 0 ? (
        <div className="no-artifacts">
          <p>No artifacts found. Add your first artifact to get started!</p>
        </div>
      ) : (
        <>
          <div className={`artifacts-grid ${viewMode}`}>
            {currentArtifacts.map((artifact, index) => (
              <div
                key={artifact.id}
                style={{ '--card-index': index } as React.CSSProperties}
              >
                <ArtifactBox
                  artifact={artifact}
                  onClick={handleArtifactClick}
                />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AddArtifactModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onArtifactCreated={handleArtifactCreated}
      />
    </div>
  );
};

export default Documents; 