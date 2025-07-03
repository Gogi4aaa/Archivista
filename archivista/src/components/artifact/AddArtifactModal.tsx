import React, { useRef, useState, useEffect } from 'react';
import { CreateArtifactDto, artifactService } from '../../services/artifactService';
import toast from 'react-hot-toast';
import './ArtifactView.css';

interface FormErrors {
  [key: string]: string;
}

interface AddArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArtifactCreated: (newArtifact: any) => void;
}

const AddArtifactModal: React.FC<AddArtifactModalProps> = ({ isOpen, onClose, onArtifactCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

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
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const artifactData: CreateArtifactDto = {
        Name: formData.Name,
        Description: formData.Description,
        DiscoveryLocation: formData.DiscoveryLocation,
        Period: formData.Period,
        Type: formData.Type || 'Artifact',
        Material: formData.Material,
        image: selectedImage || undefined
      };

      const newArtifact = await artifactService.createArtifact(artifactData);
      onArtifactCreated(newArtifact);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-title">Add New Artifact</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="image-upload-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              aria-label="Upload artifact image"
            />
            <div 
              className="image-upload-area"
              onClick={triggerImagePicker}
              onKeyPress={(e) => e.key === 'Enter' && triggerImagePicker()}
              role="button"
              tabIndex={0}
              aria-label="Click to upload image"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Selected artifact" className="image-preview" />
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
              aria-required="true"
              aria-invalid={!!errors.Name}
              aria-describedby={errors.Name ? 'name-error' : undefined}
            />
            {errors.Name && (
              <span className="error-message" id="name-error" role="alert">
                {errors.Name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="Description">Description</label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              aria-describedby="description-hint"
            />
            <span id="description-hint" className="hint-text">
              Provide a detailed description of the artifact
            </span>
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
              aria-required="true"
              aria-invalid={!!errors.DiscoveryLocation}
              aria-describedby={errors.DiscoveryLocation ? 'location-error' : undefined}
            />
            {errors.DiscoveryLocation && (
              <span className="error-message" id="location-error" role="alert">
                {errors.DiscoveryLocation}
              </span>
            )}
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
              aria-required="true"
              aria-invalid={!!errors.Type}
              aria-describedby={errors.Type ? 'type-error' : undefined}
            >
              <option value="Artifact">Artifact</option>
              <option value="Tool">Tool</option>
              <option value="Pottery">Pottery</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Weapon">Weapon</option>
              <option value="Document">Document</option>
              <option value="Other">Other</option>
            </select>
            {errors.Type && (
              <span className="error-message" id="type-error" role="alert">
                {errors.Type}
              </span>
            )}
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
            <button 
              type="submit" 
              className="button" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Artifact'}
            </button>
            <button 
              type="button" 
              className="button secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArtifactModal; 