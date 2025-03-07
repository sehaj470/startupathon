// API configuration for both development and production environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get the current domain
const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

// Dynamically determine API URL based on the current domain
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
  AUTH: '/api/auth',
  
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

// Helper function to get auth config for protected routes
export const getAuthConfig = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': contentType,
      'Accept': 'application/json'
    },
    withCredentials: false,
    timeout: 30000
  };
};

// Helper function for making API requests with error handling and retries
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
    
    // Add authorization token if available
    if (localStorage.getItem('token')) {
      defaultConfig.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    
    const mergedConfig = { ...defaultConfig, ...config };
    
    // Prepare the URL - ensure it has the correct base URL
    const fullUrl = url.startsWith('http') ? url : `${normalizedApiUrl}${url}`;
    
    console.log(`Full request URL: ${fullUrl}`);
    
    // Implement retry logic with progressive backoff
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        let response;
        
        // Make the request based on the method
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
        retryCount++;
        
        // Only retry on specific error conditions
        const shouldRetry = (
          // No response or server errors (5xx)
          !error.response || 
          (error.response && error.response.status >= 500) ||
          // Network errors
          error.code === 'ECONNABORTED' || 
          error.message.includes('Network Error')
        );
        
        if (!shouldRetry || retryCount > MAX_RETRIES) {
          console.log(`Not retrying request to ${fullUrl}: ${retryCount > MAX_RETRIES ? 'Max retries exceeded' : 'Non-retriable error'}`);
          break;
        }
        
        // Calculate backoff delay: 1s, 3s, 9s
        const delayMs = Math.pow(3, retryCount - 1) * 1000;
        console.log(`Retrying request to ${fullUrl} in ${delayMs}ms (attempt ${retryCount} of ${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    // If we get here with a lastError, we've exhausted retries
    if (lastError) {
      throw lastError;
    }
    
    // This should not happen, but just in case
    throw new Error(`Request failed after ${MAX_RETRIES} retries`);
  } catch (error) {
    console.error(`Error in ${method} request to ${url}:`, error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
      
      // For authentication errors, clear token and redirect to login
      if (error.response.status === 401) {
        console.log('Authentication error - clearing token');
        localStorage.removeItem('token');
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
      
      throw {
        message: error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw {
        message: 'No response from server. The server might be down or there might be a network/CORS issue.',
        request: error.request
      };
    } else {
      // Something happened in setting up the request that triggered an Error
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