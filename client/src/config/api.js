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
} else if (currentDomain.includes('localhost')) {
  apiUrl = 'http://localhost:5000';
}

// Remove trailing slash if present
const normalizedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

console.log('Using API URL:', normalizedApiUrl);

// Export API endpoints for use throughout the application
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  
  // Status endpoints
  HEALTH: '/api/health',
  DB_STATUS: '/api/db-status',
  
  // Data endpoints
  CHALLENGES: '/api/challenges',
  CHALLENGE: (id) => `/api/challenges/${id}`,
  COMPLETERS: '/api/completers',
  COMPLETER: (id) => `/api/completers/${id}`,
  SUBSCRIBSERS: '/api/subscribers',
  FOUNDERS: '/api/founders',
  USERS: '/api/users',
  USER: (id) => `/api/users/${id}`,
  
  // Admin actions
  UPLOAD: '/api/upload'
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
      withCredentials: false, // Disable credentials for CORS
      timeout: 30000,
      mode: 'cors'
    };
    
    const mergedConfig = { ...defaultConfig, ...config };
    
    // Add retry logic
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        let response;
        const fullUrl = url.startsWith('http') ? url : `${normalizedApiUrl}${url}`;
        
        if (method.toLowerCase() === 'get') {
          response = await axios.get(fullUrl, mergedConfig);
        } else if (method.toLowerCase() === 'post') {
          response = await axios.post(fullUrl, data, mergedConfig);
        } else if (method.toLowerCase() === 'put') {
          response = await axios.put(fullUrl, data, mergedConfig);
        } else if (method.toLowerCase() === 'delete') {
          response = await axios.delete(fullUrl, mergedConfig);
        } else {
          throw new Error(`Unsupported method: ${method}`);
        }
        
        console.log(`${method} request to ${fullUrl} successful:`, response.data);
        return response.data;
      } catch (error) {
        lastError = error;
        
        // Check if there's a CORS issue
        if (error.message && error.message.includes('NetworkError') || error.message.includes('Network Error')) {
          console.warn('Network error detected (possible CORS issue), retrying with alternative approach...');
          retries = 0; // Don't retry with the same approach
          
          // Try an alternative approach - using a JSONP-like approach or proxy if available
          throw error; // For now, just throw the error
        }
        
        if (error.response && error.response.status !== 500) {
          throw error; // Don't retry if it's not a server error
        }
        
        retries--;
        if (retries > 0) {
          const delay = 1000 * (4 - retries); // Progressive backoff: 1s, 2s, 3s
          console.log(`Retrying request to ${url} in ${delay}ms, ${retries} attempts remaining`);
          await new Promise(resolve => setTimeout(resolve, delay));
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
        message: 'No response from server. The server might be down or there might be a network/CORS issue.',
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