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
        await apiRequest('delete', `${API_ENDPOINTS.ADMIN_COMPLETERS}/${id}`, null, getAuthConfig());
        
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

  // Loading state
  if (isLoading && completers.length === 0) {
    return (
      <div className="bg-[#0A0111] min-h-screen py-8 text-white text-center font-sans">
        Loading completers...
      </div>
    );
  }

  return (
    <div className="bg-[#0A0111] min-h-screen py-8 text-white font-sans px-6">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl md:text-4xl font-bold">Manage Completers</h1>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF] transition-colors cursor-pointer"
        >
          {showAddForm ? 'Cancel' : 'Add New Completer'}
        </button>
      </div>

      {/* Display errors */}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#1E0635] p-6 rounded-lg mb-8 border border-[#8B6FD0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Project Name</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Profile</label>
              <input
                type="text"
                value={formData.profile}
                onChange={(e) => setFormData({...formData, profile: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Funding</label>
              <input
                type="text"
                value={formData.funding}
                onChange={(e) => setFormData({...formData, funding: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Visible</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                  className="mr-2 h-5 w-5"
                />
                <span>Show on website</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 rounded bg-[#0A0111] border border-[#8B6FD0] h-32"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Profile Picture</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 bg-[#0A0111] rounded border border-[#8B6FD0]"
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
              className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition-colors"
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

      {/* Completers Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completers.map(completer => (
            <div
              key={completer._id}
              className="bg-[#1E0635] rounded-lg p-4 w-full transition-colors hover:bg-[#19052d] flex flex-col border border-[#8B6FD0]"
            >
              {/* Project Name */}
              <h2 className="text-2xl font-semibold text-white mb-3">
                {completer.projectName}
              </h2>

              {/* Two-Column Layout */}
              <div className="flex flex-row flex-grow gap-4">
                {/* Left Column: image */}
                <div className="w-1/2 flex flex-col items-center">
                  <div className="relative w-full h-32">
                    <img
                      src={getImageUrl(completer.profilePicture)}
                      alt={completer.profile}
                      className="absolute w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </div>

                {/* Right Column: Profile/Position/Visibility */}
                <div className="w-1/2 flex flex-col">
                  <h3 className="text-lg font-bold text-white">
                    {completer.profile}
                  </h3>
                  <p className="text-gray-300">{completer.position}</p>
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-300 mr-2">Visibility:</span>
                    <span className={`text-sm ${completer.visible ? 'text-green-400' : 'text-red-400'}`}>
                      {completer.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {/* LinkedIn Icon */}
                  <div className="mt-2">
                    <a
                      href={completer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#7745f5] hover:bg-blue-500 transition-colors"
                    >
                      {/* LinkedIn 'in' SVG icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 448 512"
                        className="w-4 h-4 text-white"
                      >
                        <path d="M100.28 448H7.4V149.5h92.88zM53.79 108.1a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.34-79.3-48.4 0-55.8 37.8-55.8 76.7V448H158V149.5h89V185h1.3c12.4-23.5 42.6-48.3 87.7-48.3 93.9 0 111.1 61.8 111.1 142.3V448z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Funding */}
              <p className="mt-3 text-md text-white">
                Initial Funding: 
                <span className="ml-1 text-[#714EC4] font-bold">
                  {completer.funding}
                </span>
              </p>

              {/* Description (truncated) */}
              <p className="text-gray-300 text-sm mt-2 line-clamp-2 mb-3">
                {completer.description}
              </p>

              {/* Admin Actions */}
              <div className="flex justify-between mt-auto pt-2">
                <button
                  onClick={() => handleDelete(completer._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  Delete
                </button>
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      console.log('Fetching completer for editing:', completer._id);
                      const data = await apiRequest('get', `${API_ENDPOINTS.ADMIN_COMPLETERS}/${completer._id}`);
                      console.log('Received completer data for editing:', data);
                      
                      if (data) {
                        // Pre-fill the form
                        setFormData({
                          projectName: data.projectName || '',
                          profile: data.profile || '',
                          position: data.position || '',
                          description: data.description || '',
                          funding: data.funding || '',
                          linkedinUrl: data.linkedinUrl || '',
                          visible: data.visible !== false // Default to true if undefined
                        });
                        
                        // Set the editing ID and show the form
                        setEditingId(completer._id);
                        setShowAddForm(true);
                        
                        // Scroll to the form
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setError('Failed to load completer data for editing');
                      }
                    } catch (err) {
                      console.error('Error fetching completer for editing:', err);
                      setError('Failed to load completer data: ' + (err.message || 'Unknown error'));
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="bg-[#7F5ED5] text-white px-3 py-1 rounded hover:bg-[#855DEF] transition-colors"
                  disabled={isLoading}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No completers message */}
        {completers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-400">No completers found. Add your first completer using the button above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletersAdmin;