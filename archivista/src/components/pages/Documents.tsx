import React, { useState, useRef, useEffect } from 'react';
import { Artifact, CreateArtifactDto, artifactService } from '../../services/artifactService';
import ArtifactView from '../artifact/ArtifactView';
import Pagination from '../common/Pagination';
import '../artifact/ArtifactView.css';
import './Documents.css';
import toast from 'react-hot-toast';
import axios from 'axios';

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
    title: '',
    description: '',
    period: '',
    location: {
      site: '',
    },
    condition: 'Good',
    category: ['Artifact'],
    image: undefined,
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

  // Sort artifacts based on current sort settings
  const sortedArtifacts = [...artifacts].sort((a, b) => {
    let compareValueA: string | number = '';
    let compareValueB: string | number = '';

    switch (sortBy) {
      case 'date':
        compareValueA = a.metadata?.createdAt || '';
        compareValueB = b.metadata?.createdAt || '';
        break;
      case 'type':
        compareValueA = a.category?.[0] || '';
        compareValueB = b.category?.[0] || '';
        break;
      case 'title':
        compareValueA = a.title;
        compareValueB = b.title;
        break;
    }

    if (sortOrder === 'asc') {
      return compareValueA > compareValueB ? 1 : -1;
    } else {
      return compareValueA < compareValueB ? 1 : -1;
    }
  });

  const currentArtifacts = sortedArtifacts.slice(startIndex, endIndex);

  const handleSort = (type: 'date' | 'type' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location.site.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.condition.trim()) {
      newErrors.condition = 'Condition is required';
    }
    
    if (!formData.category.length) {
      newErrors.category = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      period: '',
      location: {
        site: '',
      },
      condition: 'Good',
      category: ['Artifact'],
      image: undefined,
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const artifactData = {
        ...formData,
        image: selectedImage || undefined
      };
      
      await artifactService.createArtifact(artifactData);
      toast.success('Artifact created successfully');
      setIsFormOpen(false);
      resetForm();
      await fetchArtifacts();
    } catch (error) {
      console.error('Error creating artifact:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to create artifact: ${error.response.data.message || error.response.data.title || 'Unknown error'}`);
      } else {
        toast.error('Failed to create artifact');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'site') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          site: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
                key={artifact.id} 
                className="artifact-card"
                onClick={() => {
                  setSelectedArtifact(artifact);
                  setViewMode('detail');
                }}
              >
                <div className="artifact-card-image">
                  {artifact.images[0] && (
                    <img 
                      src={artifact.images[0].url} 
                      alt={artifact.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  )}
                </div>
                <div className="artifact-card-content">
                  <h3>{artifact.title}</h3>
                  <div className="artifact-card-metadata">
                    <span className="period">{artifact.period}</span>
                    <span className="status">{artifact.status}</span>
                  </div>
                  <p className="artifact-card-description">{artifact.description.slice(0, 100)}...</p>
                </div>
                <div className="artifact-card-footer">
                  <div className="artifact-card-tags">
                    {artifact.category.slice(0, 2).map((cat, index) => (
                      <span key={index} className="category-badge">{cat}</span>
                    ))}
                  </div>
                  {artifact.featured && <span className="featured">Featured</span>}
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
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="site">Location*</label>
                <input
                  type="text"
                  id="site"
                  name="site"
                  value={formData.location.site}
                  onChange={handleChange}
                  className={errors.location ? 'error' : ''}
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="period">Period</label>
                <input
                  type="text"
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="condition">Condition*</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={errors.condition ? 'error' : ''}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                {errors.condition && <span className="error-message">{errors.condition}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: [e.target.value] }))}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="Artifact">Artifact</option>
                  <option value="Tool">Tool</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Weapon">Weapon</option>
                  <option value="Document">Document</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
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