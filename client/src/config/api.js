// API configuration for both development and production environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Base API endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  CHALLENGES: `${API_URL}/api/challenges`,
  COMPLETERS: `${API_URL}/api/completers`,
  SUBSCRIBERS: `${API_URL}/api/subscribers`,
  
  // Admin endpoints
  AUTH: `${API_URL}/api/auth`,
  ADMIN_CHALLENGES: `${API_URL}/api/admin/challenges`,
  ADMIN_FOUNDERS: `${API_URL}/api/admin/founders`,
  ADMIN_COMPLETERS: `${API_URL}/api/admin/completers`,
  ADMIN_SUBSCRIBERS: `${API_URL}/api/admin/subscribers`,
};

// Helper function to get auth config for protected routes
export const getAuthConfig = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': contentType
    }
  };
};

// File upload validation
export const validateFileUpload = (file, maxSizeMB = 3) => {
  // Check if file exists
  if (!file) return { valid: false, error: 'No file selected' };
  
  // Check file type (only images)
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are allowed' };
  }
  
  // Check file size (max 3MB by default)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds ${maxSizeMB}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
    };
  }
  
  return { valid: true };
};

export default API_ENDPOINTS; 