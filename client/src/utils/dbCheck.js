import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Checks the database connection status by calling the server's db-status endpoint
 * @returns {Promise<Object>} The database connection status
 */
export const checkDatabaseConnection = async () => {
  try {
    // Remove the /api part from the endpoint to get the base URL
    const baseUrl = API_ENDPOINTS.CHALLENGES.split('/api')[0];
    const response = await axios.get(`${baseUrl}/api/db-status`);
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
    // Remove the /api part from the endpoint to get the base URL
    const baseUrl = API_ENDPOINTS.CHALLENGES.split('/api')[0];
    const response = await axios.get(`${baseUrl}/api/health`);
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