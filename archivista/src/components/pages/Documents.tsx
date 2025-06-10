import React, { useState, useRef, useEffect } from 'react';
import { Artifact, CreateArtifactDto, artifactService } from '../../services/artifactService';
import ArtifactView from '../artifact/ArtifactView';
import Pagination from '../common/Pagination';
import '../artifact/ArtifactView.css';
import './Documents.css';
import toast from 'react-hot-toast';
import axios from 'axios';

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

  const [formData, setFormData] = useState<CreateArtifactDto>({
    Name: '',
    Description: '',
    DiscoveryLocation: '',
    Period: '',
    Type: 'Artifact',
    Material: '',
    image: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const fetchArtifacts = async () => {
    setIsLoading(true);
    try {
      const data = await artifactService.getAllArtifacts();
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

  const itemsPerPage = 6;
  const totalPages = Math.ceil(artifacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentArtifacts = artifacts
    .slice(startIndex, endIndex)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc'
            ? new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
            : new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
        case 'type':
          return sortOrder === 'asc'
            ? (a.Type || '').localeCompare(b.Type || '')
            : (b.Type || '').localeCompare(a.Type || '');
        case 'title':
          return sortOrder === 'asc'
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
        default:
          return 0;
      }
    });

  const handleSort = (type: 'date' | 'type' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }

    const sorted = [...artifacts].sort((a, b) => {
      let valueA, valueB;
      switch (type) {
        case 'date':
          valueA = new Date(a.CreatedAt).getTime();
          valueB = new Date(b.CreatedAt).getTime();
          break;
        case 'type':
          valueA = a.Type || '';
          valueB = b.Type || '';
          break;
        case 'title':
          valueA = a.Name;
          valueB = b.Name;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setArtifacts(sorted);
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

  if (viewMode === 'detail' && selectedArtifact) {
    return (
      <div className="content">
        <div className="actions-container">
          <button 
            className="button secondary"
            onClick={() => {
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
          Showing {startIndex + 1}-{Math.min(endIndex, artifacts.length)} of {artifacts.length} artifacts
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading artifacts...</p>
        </div>
      ) : artifacts.length === 0 ? (
        <div className="no-artifacts">
          <p>No artifacts found. Add your first artifact to get started!</p>
        </div>
      ) : (
        <>
          <div className={`artifacts-grid ${viewMode}`}>
            {currentArtifacts.map(artifact => (
              <div 
                key={artifact.Id} 
                className="artifact-card"
                onClick={() => {
                  setSelectedArtifact(artifact);
                  setViewMode('detail');
                }}
              >
                <div className="artifact-card-image">
                  <img 
                    src={artifact.ImageUrl ? `${baseUrl}${artifact.ImageUrl}` : '/noimage.png'} 
                    alt={artifact.Name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/noimage.png';
                    }}
                  />
                </div>
                <div className="artifact-card-content">
                  <h3>{artifact.Name}</h3>
                  <div className="artifact-card-metadata">
                    <span className="period">{artifact.Period}</span>
                    <span className="status">{artifact.Type}</span>
                  </div>
                  <p className="artifact-card-description">{artifact.Description?.slice(0, 100)}...</p>
                </div>
                <div className="artifact-card-footer">
                  <div className="artifact-card-tags">
                    {artifact.Type && (
                      <span className="category-badge">{artifact.Type}</span>
                    )}
                    {artifact.Material && (
                      <span className="category-badge">{artifact.Material}</span>
                    )}
                  </div>
                </div>
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

      {/* Add New Artifact Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Artifact</h2>
              <button className="close-button" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="image-upload-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div 
                  className="image-upload-area"
                  onClick={triggerImagePicker}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📸</span>
                      <span>Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="Name">Title*</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className={errors.Name ? 'error' : ''}
                />
                {errors.Name && <span className="error-message">{errors.Name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Description">Description</label>
                <textarea
                  id="Description"
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="DiscoveryLocation">Location*</label>
                <input
                  type="text"
                  id="DiscoveryLocation"
                  name="DiscoveryLocation"
                  value={formData.DiscoveryLocation}
                  onChange={handleChange}
                  className={errors.DiscoveryLocation ? 'error' : ''}
                />
                {errors.DiscoveryLocation && <span className="error-message">{errors.DiscoveryLocation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Period">Period</label>
                <input
                  type="text"
                  id="Period"
                  name="Period"
                  value={formData.Period}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="Type">Type*</label>
                <select
                  id="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  className={errors.Type ? 'error' : ''}
                >
                  <option value="Artifact">Artifact</option>
                  <option value="Tool">Tool</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Weapon">Weapon</option>
                  <option value="Document">Document</option>
                  <option value="Other">Other</option>
                </select>
                {errors.Type && <span className="error-message">{errors.Type}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Material">Material</label>
                <input
                  type="text"
                  id="Material"
                  name="Material"
                  value={formData.Material}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="button" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Artifact'}
                </button>
                <button 
                  type="button" 
                  className="button secondary"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents; 