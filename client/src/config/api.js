// API configuration for both development and production environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
const normalizedApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

// Base API endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  CHALLENGES: `${normalizedApiUrl}/api/challenges`,
  COMPLETERS: `${normalizedApiUrl}/api/completers`,
  SUBSCRIBERS: `${normalizedApiUrl}/api/subscribers`,
  
  // Admin endpoints
  AUTH: `${normalizedApiUrl}/api/auth`,
  ADMIN_CHALLENGES: `${normalizedApiUrl}/api/admin/challenges`,
  ADMIN_FOUNDERS: `${normalizedApiUrl}/api/admin/founders`,
  ADMIN_COMPLETERS: `${normalizedApiUrl}/api/admin/completers`,
  ADMIN_SUBSCRIBERS: `${normalizedApiUrl}/api/admin/subscribers`,
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

// Helper function to get image URL (handles both Cloudinary and local images)
export const getImageUrl = (imagePath, type = 'challenges') => {
  if (!imagePath) return 'https://via.placeholder.com/300';
  
  // Check if the image path is already a full URL (Cloudinary)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For production (Vercel), use Cloudinary
  if (import.meta.env.PROD || normalizedApiUrl.includes('vercel.app')) {
    // Default Cloudinary URL pattern
    return `https://res.cloudinary.com/dvdnfmmia/image/upload/startupathon/${type}/${imagePath}`;
  }
  
  // For local development
  return `${normalizedApiUrl}/uploads/${type}/${imagePath}`;
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