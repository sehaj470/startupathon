import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/80';
  return `http://localhost:5000/uploads/completers/${imagePath}`;
};

const CompletersAdmin = () => {
  const navigate = useNavigate(); 
  const [completers, setCompleters] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    projectName: '',
    profile: '',
    position: '',
    description: '',
    funding: '',
    linkedinUrl: '',
    visible: true
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      throw new Error('No token found');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer prefix here
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCompleters();
    } else {
      navigate('/admin/login');
    }
  }, []); // Remove token dependency

  const fetchCompleters = async () => {
    try {
      console.log('Fetching completers...');
      const res = await axios.get(
        'http://localhost:5000/api/admin/completers',
        getAuthConfig()
      );
      console.log('Completers response:', res.data);
      setCompleters(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
      console.error('Error details:', err);
      alert('Failed to fetch completers: ' + err.message);
    }
  };

  const fetchCompleterById = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/completers/${id}`,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      console.error('Error fetching completer:', err);
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
      return null;
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'visible') {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      if (imageFile) {
        formDataToSend.append('profilePicture', imageFile);
      }

            // Log the form data being sent
      console.log('Form data being sent:', {
        ...Object.fromEntries(formDataToSend),
        visible: formData.visible
      });
  
      const config = {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'multipart/form-data'
        }
      };
  
      let res;
      if (editingId) {
        // Update existing completer
        res = await axios.put(
          `http://localhost:5000/api/admin/completers/${editingId}`,
          formDataToSend,
          config
        );
        setCompleters(completers.map(comp => comp._id === editingId ? res.data : comp));
      } else {
        // Create new completer
        res = await axios.post(
          'http://localhost:5000/api/admin/completers',
          formDataToSend,
          config
        );
        setCompleters([...completers, res.data]);
      }
      
      console.log('Response:', res.data);
      resetForm();
    } catch (err) {
      console.error('Submit error details:', err);
      alert(`Failed to ${editingId ? 'update' : 'submit'} completer: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this completer?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
  
        await axios.delete(
          `http://localhost:5000/api/admin/completers/${id}`,
          config
        );
        
        // Update the state after successful deletion
        setCompleters(completers.filter(comp => comp._id !== id));
      } catch (err) {
        console.error('Delete error details:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        alert('Failed to delete completer: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      profile: '',
      position: '',
      description: '',
      funding: '',
      linkedinUrl: '',
      visible: true
    });
    setImageFile(null);
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-6 bg-[#0A0111] min-h-screen text-white">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold mb-6">Manage Completers</h1>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF] transition-colors mb-6 cursor-pointer"
        >
          {showAddForm ? 'Cancel' : 'Add New Completer'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#1c0c2e] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Project Name</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Profile</label>
              <input
                type="text"
                value={formData.profile}
                onChange={(e) => setFormData({...formData, profile: e.target.value})}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Funding</label>
              <input
                type="text"
                value={formData.funding}
                onChange={(e) => setFormData({...formData, funding: e.target.value})}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 h-32"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                  className="rounded"
                />
                <span>Visible</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF]"
          >
            {editingId ? 'Update' : 'Add'} Completer
          </button>
        </form>
      )}

      {/* Completers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completers.map(completer => (
          <div key={completer._id} className="bg-[#1c0c2e] p-6 rounded-lg">
            <div className="flex items-center mb-4">
              {completer.profilePicture && (
                <img
                src={getImageUrl(completer.profilePicture)}
                alt={completer.profile}
                className="w-16 h-16 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
              )}
              <div>
                <h3 className="text-xl font-bold">{completer.projectName}</h3>
                <p className="text-gray-300">{completer.position}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4 line-clamp-3">{completer.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-400">
                Funding: {completer.funding}
              </p>
              <span className={`px-2 py-1 rounded text-sm ${completer.visible ? 'bg-green-600' : 'bg-red-600'}`}>
                {completer.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>

            <div className="flex justify-end space-x-2">
            <button
              onClick={async () => {
                const completerData = await fetchCompleterById(completer._id);
                if (completerData) {
                  setEditingId(completer._id);
                  setFormData({
                    projectName: completerData.projectName,
                    profile: completerData.profile,
                    position: completerData.position,
                    description: completerData.description,
                    funding: completerData.funding,
                    linkedinUrl: completerData.linkedinUrl,
                    visible: Boolean(completerData.visible) // Ensure boolean conversion
                  });
                  setShowAddForm(true);
                }
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
              <button
                onClick={() => handleDelete(completer._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletersAdmin;