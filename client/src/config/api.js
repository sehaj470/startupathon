// API configuration for both development and production environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get the current domain
const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

// Determine the API domain based on the current domain
let apiUrl = API_URL;
if (currentDomain.includes('startupathon-kdu7.vercel.app')) {
  apiUrl = 'https://startupathon.vercel.app';
} else if (currentDomain.includes('startupathon.vercel.app')) {
  apiUrl = 'https://startupathon.vercel.app';
}

// Remove trailing slash if present
const normalizedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

console.log('Using API URL:', normalizedApiUrl);

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
      'Content-Type': contentType,
      'Accept': 'application/json'
    },
    withCredentials: false, // Disable sending cookies for cross-origin requests
    timeout: 30000 // 30 seconds timeout
  };
};

// Helper function for making API requests with error handling
export const apiRequest = async (method, url, data = null, config = {}) => {
  const axios = (await import('axios')).default;
  
  try {
    console.log(`Making ${method} request to:`, url);
    
    const defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true, // Enable credentials for CORS
      timeout: 30000
    };
    
    const mergedConfig = { ...defaultConfig, ...config };
    
    // Add retry logic
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        let response;
        if (method.toLowerCase() === 'get') {
          response = await axios.get(url, mergedConfig);
        } else if (method.toLowerCase() === 'post') {
          response = await axios.post(url, data, mergedConfig);
        } else if (method.toLowerCase() === 'put') {
          response = await axios.put(url, data, mergedConfig);
        } else if (method.toLowerCase() === 'delete') {
          response = await axios.delete(url, mergedConfig);
        } else {
          throw new Error(`Unsupported method: ${method}`);
        }
        
        console.log(`${method} request to ${url} successful:`, response.data);
        return response.data;
      } catch (error) {
        lastError = error;
        if (error.response && error.response.status !== 500) {
          throw error; // Don't retry if it's not a server error
        }
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          console.log(`Retrying request to ${url}, ${retries} attempts remaining`);
        }
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error(`Error in ${method} request to ${url}:`, error);
    
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
      throw {
        message: error.response.data?.error || `Server error: ${error.response.status}`,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw {
        message: 'No response from server. Please check your internet connection.',
        request: error.request
      };
    } else {
      console.error('Error setting up request:', error.message);
      throw {
        message: `Request error: ${error.message}`,
        error: error
      };
    }
  }
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