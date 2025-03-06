// client/src/pages/Admin/CreateChallengeForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateChallengeForm = ({ onChallengeCreated }) => {
  const [title, setTitle] = useState('');
  const [funding, setFunding] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // const newChallenge = { title, funding, deadline, description, visible };
      const res = await axios.post('http://localhost:5000/api/admin/challenges', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
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
      console.error(err);
      alert('Failed to create challenge.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>Create New Challenge</h3>
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

      {/* New file input for uploading an image */}
      <div>
        <label>Upload Image: </label>
        <input 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Create Challenge</button>
    </form>
  );
};

export default CreateChallengeForm;
