import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest, getAuthConfig, validateFileUpload } from '../../config/api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/80';
  
  // Check if the image path is already a full URL (Cloudinary)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Use the normalized API URL from config
  const baseUrl = process.env.REACT_APP_API_URL || 'https://startupathon.vercel.app';
  return `${baseUrl}/uploads/completers/${imagePath}`;
};

const CompletersAdmin = () => {
  const navigate = useNavigate(); 
  const [completers, setCompleters] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    profile: '',
    position: '',
    description: '',
    funding: '',
    linkedinUrl: '',
    visible: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCompleters();
    } else {
      navigate('/admin/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCompleters = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching completers from admin endpoint...');
      
      // Use apiRequest with the admin endpoint
      const data = await apiRequest('get', API_ENDPOINTS.ADMIN_COMPLETERS);
      
      console.log('Completers response:', data);
      
      // Check if we got a valid response
      if (Array.isArray(data)) {
        if (data.length === 0) {
          console.log('No completers found in database');
          setCompleters([]);
        } else {
          console.log(`Found ${data.length} completers`);
          setCompleters(data);
        }
      } else {
        console.error('Unexpected data format:', data);
        setError('Received invalid data format from server');
        setCompleters([]);
      }
    } catch (err) {
      console.error('Error fetching completers:', err);
      setError(err.message || 'Error fetching completers');
      setCompleters([]);
      
      // Handle authentication errors
      if (err.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompleterById = async (id) => {
    try {
      setIsLoading(true);
      const res = await apiRequest('get', `${API_ENDPOINTS.ADMIN_COMPLETERS}/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching completer:', err);
      if (err.status === 401) {
        navigate('/admin/login');
      }
      setError('Failed to fetch completer: ' + (err.response?.data?.error || err.message));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
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
  
      const config = getAuthConfig('multipart/form-data');
  
      let res;
      if (editingId) {
        // Update existing completer
        res = await apiRequest('put', `${API_ENDPOINTS.ADMIN_COMPLETERS}/${editingId}`, formDataToSend, config);
        setCompleters(completers.map(comp => comp._id === editingId ? res.data : comp));
      } else {
        // Create new completer
        res = await apiRequest('post', API_ENDPOINTS.ADMIN_COMPLETERS, formDataToSend, config);
        setCompleters([...completers, res.data]);
      }
      
      console.log('Response:', res.data);
      resetForm();
    } catch (err) {
      console.error('Submit error details:', err);
      setError(`Failed to ${editingId ? 'update' : 'submit'} completer: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this completer?')) {
      try {
        setIsLoading(true);
        await apiRequest('delete', `${API_ENDPOINTS.ADMIN_COMPLETERS}/${id}`, getAuthConfig());
        
        // Update the state after successful deletion
        setCompleters(completers.filter(comp => comp._id !== id));
      } catch (err) {
        console.error('Delete error details:', err);
        if (err.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        setError('Failed to delete completer: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsLoading(false);
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
    setError('');
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

      {/* Display errors */}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

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
              <label className="block mb-2">Visible</label>
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                className="mr-2"
              />
              <span>Show on website</span>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 h-32"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Profile Picture</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2"
                accept="image/*"
              />
              <small className="text-gray-400 block mt-1">
                Only image files, max 3MB
              </small>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (editingId ? 'Update Completer' : 'Add Completer')}
            </button>
          </div>
        </form>
      )}

      {/* Completers List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1c0c2e] rounded-lg">
          <thead>
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Visible</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {completers.map(completer => (
              <tr key={completer._id} className="border-t border-gray-700">
                <td className="p-3">
                  <img 
                    src={getImageUrl(completer.profilePicture)} 
                    alt={completer.projectName}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{completer.projectName}</td>
                <td className="p-3">{completer.profile}</td>
                <td className="p-3">{completer.position}</td>
                <td className="p-3">{completer.visible ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(completer._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded mr-2"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    onClick={async () => {
                      const data = await fetchCompleterById(completer._id);
                      if (data) {
                        setFormData({
                          projectName: data.projectName,
                          profile: data.profile,
                          position: data.position,
                          description: data.description,
                          funding: data.funding,
                          linkedinUrl: data.linkedinUrl,
                          visible: data.visible
                        });
                        setEditingId(data._id);
                        setShowAddForm(true);
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletersAdmin;