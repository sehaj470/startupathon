// client/src/pages/Admin/CreateChallengeForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getAuthConfig, validateFileUpload } from '../../config/api';

const CreateChallengeForm = ({ onChallengeCreated }) => {
  const [title, setTitle] = useState('');
  const [funding, setFunding] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setError(validation.error);
      e.target.value = ''; // Clear the file input
      return;
    }
    
    setError(''); // Clear any previous errors
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('funding', funding);
    formData.append('deadline', deadline);
    formData.append('description', description);
    formData.append('visible', visible);
    
    // Append the file if available
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const config = getAuthConfig('multipart/form-data');
      const res = await axios.post(API_ENDPOINTS.ADMIN_CHALLENGES, formData, config);
      
      // Clear form fields after success
      setTitle('');
      setFunding('');
      setDeadline('');
      setDescription('');
      setVisible(true);
      setImageFile(null);
      
      // Pass the new challenge back to parent component
      onChallengeCreated(res.data);
    } catch (err) {
      console.error('Error creating challenge:', err);
      setError(err.response?.data?.error || 'Failed to create challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>Create New Challenge</h3>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      
      <div>
        <label>Title: </label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Funding: </label>
        <input 
          type="text" 
          value={funding} 
          onChange={(e) => setFunding(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Deadline: </label>
        <input 
          type="date" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description: </label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Visible: </label>
        <input 
          type="checkbox" 
          checked={visible} 
          onChange={(e) => setVisible(e.target.checked)}
        />
      </div>

      {/* File input with validation */}
      <div>
        <label>Upload Image: </label>
        <input 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <small style={{ display: 'block', marginTop: '5px' }}>
          Only image files, max 3MB
        </small>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? 'Creating...' : 'Create Challenge'}
      </button>
    </form>
  );
};

export default CreateChallengeForm;
