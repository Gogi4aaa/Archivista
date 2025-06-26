import React, { useRef, useState, useEffect } from 'react';
import { Artifact, artifactService, UpdateArtifactDto } from '../../services/artifactService';
import toast from 'react-hot-toast';
import './ArtifactView.css';

interface FormErrors {
  [key: string]: string;
}

interface EditArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: Artifact;
  onArtifactUpdated: (updatedArtifact: Artifact) => void;
}

interface FormData {
  title: string;
  description: string;
  location: {
    site: string;
  };
  period: string;
  category: string[];
  condition: string;
}

const EditArtifactModal: React.FC<EditArtifactModalProps> = ({ isOpen, onClose, artifact, onArtifactUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: {
      site: '',
    },
    period: '',
    category: ['Artifact'],
    condition: 'Good'
  });

  useEffect(() => {
    if (isOpen && artifact) {
      setFormData({
        title: artifact.name,
        description: artifact.description || '',
        location: {
          site: artifact.discoveryLocation,
        },
        period: artifact.period || '',
        category: [artifact.type || 'Artifact'],
        condition: 'Good'
      });
      setImagePreview(artifact.loadedImageUrl || null);
    }
  }, [isOpen, artifact]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields (e.g., location.site)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Name is required';
    }
    
    if (!formData.location.site.trim()) {
      newErrors.location = 'Discovery location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updateDto: UpdateArtifactDto = {
        title: formData.title,
        description: formData.description,
        location: {
          site: formData.location.site,
        },
        period: formData.period,
        category: formData.category,
        condition: formData.condition,
      };

      const updatedArtifact = await artifactService.updateArtifact(artifact.id, updateDto);
      onArtifactUpdated(updatedArtifact);
      toast.success('Artifact updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating artifact:', error);
      toast.error('Failed to update artifact');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Edit Artifact</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Name*</label>
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
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location.site">Discovery Location*</label>
            <input
              type="text"
              id="location.site"
              name="location.site"
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
            <label htmlFor="category">Type</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, category: [e.target.value] }))}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Artifact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArtifactModal; 