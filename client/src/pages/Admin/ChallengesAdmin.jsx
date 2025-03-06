import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/80';
  return `http://localhost:5000/uploads/challenges/${imagePath}`;
};

const ChallengesAdmin = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    funding: '',
    deadline: '',
    description: '',
    visible: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchChallenges();
    } else {
      navigate('/admin/login');
    }
  }, []); // Remove token from dependency array

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

  const fetchChallenges = async () => {
    try {
      console.log('Fetching challenges...');
      const res = await axios.get(
        'http://localhost:5000/api/admin/challenges',
        getAuthConfig()
      );
      console.log('Challenges response:', res.data);
      setChallenges(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
      console.error('Error details:', err);
      alert('Failed to fetch challenges: ' + err.message);
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
      
      // Handle all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'visible') {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
  
      // Debug logging
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
        res = await axios.put(
          `http://localhost:5000/api/admin/challenges/${editingId}`,
          formDataToSend,
          config
        );
        // Update challenges array with edited challenge
        setChallenges(challenges.map(ch => ch._id === editingId ? res.data : ch));
      } else {
        res = await axios.post(
          'http://localhost:5000/api/admin/challenges',
          formDataToSend,
          config
        );
        setChallenges([...challenges, res.data]);
      }
      
      console.log('Response:', res.data);
      resetForm();
    } catch (err) {
      console.error('Submit error details:', err);
      alert(`Failed to ${editingId ? 'update' : 'submit'} challenge: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        };
  
        await axios.delete(
          `http://localhost:5000/api/admin/challenges/${id}`,
          config
        );
        setChallenges(challenges.filter((ch) => ch._id !== id));
      } catch (err) {
        console.error('Error deleting challenge:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        alert('Failed to delete challenge');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      funding: '',
      deadline: '',
      description: '',
      visible: true,
    });
    setImageFile(null);
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-6 bg-[#0A0111] min-h-screen text-white">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold mb-6 ">Manage Challenges</h1>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF] transition-colors mb-6 cursor-pointer"
        >
          {showAddForm ? 'Cancel' : 'Add New Challenge'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#1c0c2e] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Funding</label>
              <input
                type="text"
                value={formData.funding}
                onChange={(e) => setFormData({...formData, funding: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Challenge Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 text-white h-32"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                  className="rounded bg-gray-800"
                />
                <span>Visible</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF]"
          >
            {editingId ? 'Update' : 'Add'} Challenge
          </button>
        </form>
      )}

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <div key={challenge._id} className="bg-[#1c0c2e] p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={getImageUrl(challenge.image)}
                alt={challenge.title}
                className="w-16 h-16 rounded object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
              <div>
                <h3 className="text-xl font-bold">{challenge.title}</h3>
                <p className="text-purple-400">Funding: {challenge.funding}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4 line-clamp-3">{challenge.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-400">
                Deadline: {new Date(challenge.deadline).toLocaleDateString()}
              </p>
              <span className={`px-2 py-1 rounded text-sm ${challenge.visible ? 'bg-green-600' : 'bg-red-600'}`}>
                {challenge.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>

            <div className="flex justify-end space-x-2">
            <button
              onClick={async () => {
                try {
                  setEditingId(challenge._id);
                  setFormData({
                    title: challenge.title,
                    funding: challenge.funding,
                    deadline: new Date(challenge.deadline).toISOString().split('T')[0],
                    description: challenge.description,
                    visible: Boolean(challenge.visible)
                  });
                  setShowAddForm(true);
                } catch (err) {
                  console.error('Error setting up edit:', err);
                  alert('Failed to setup edit form');
                }
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
              <button
                onClick={() => handleDelete(challenge._id)}
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

export default ChallengesAdmin;