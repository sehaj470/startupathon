import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Checks the database connection status by calling the server's db-status endpoint
 * @returns {Promise<Object>} The database connection status
 */
export const checkDatabaseConnection = async () => {
  try {
    // Get the current domain
    const currentDomain = window.location.hostname;
    
    // Determine the API domain based on the current domain
    let apiDomain;
    if (currentDomain.includes('startupathon-kdu7.vercel.app')) {
      apiDomain = 'https://startupathon.vercel.app';
    } else {
      // Remove the /api part from the endpoint to get the base URL
      apiDomain = API_ENDPOINTS.CHALLENGES.split('/api')[0];
    }
    
    console.log('Checking database connection at:', `${apiDomain}/api/db-status`);
    
    const response = await axios.get(`${apiDomain}/api/db-status`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: false // Disable sending cookies for cross-origin requests
    });
    
    console.log('Database connection status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking database connection:', error);
    return {
      status: 'error',
      connected: false,
      error: error.message
    };
  }
};

/**
 * Checks the health of the server by calling the health endpoint
 * @returns {Promise<Object>} The server health status
 */
export const checkServerHealth = async () => {
  try {
    // Get the current domain
    const currentDomain = window.location.hostname;
    
    // Determine the API domain based on the current domain
    let apiDomain;
    if (currentDomain.includes('startupathon-kdu7.vercel.app')) {
      apiDomain = 'https://startupathon.vercel.app';
    } else {
      // Remove the /api part from the endpoint to get the base URL
      apiDomain = API_ENDPOINTS.CHALLENGES.split('/api')[0];
    }
    
    console.log('Checking server health at:', `${apiDomain}/api/health`);
    
    const response = await axios.get(`${apiDomain}/api/health`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: false // Disable sending cookies for cross-origin requests
    });
    
    console.log('Server health status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

export default {
  checkDatabaseConnection,
  checkServerHealth
}; 