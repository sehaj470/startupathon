const axios = require('axios');

/**
 * Test script to verify CORS headers on various endpoints
 * Run with: node cors-test.js
 */

const BASE_URL = 'https://startupathon.vercel.app';
const TEST_ENDPOINTS = [
  '/api/health',
  '/api/db-status',
  '/api/challenges',
  '/api/completers',
  '/api/subscribers',
  '/api/diagnostics/cors-test'
];

// Function to check CORS headers
async function testCorsHeaders() {
  console.log('Testing CORS headers on endpoints...\n');
  
  // Add a fake origin to simulate cross-origin requests
  const config = {
    headers: {
      'Origin': 'https://startupathon-kdu7.vercel.app'
    }
  };
  
  for (const endpoint of TEST_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Testing ${url}...`);
    
    try {
      // Make OPTIONS request to test CORS headers
      const response = await axios.options(url, config);
      
      // Check CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
      };
      
      console.log('  Status:', response.status);
      console.log('  CORS Headers:', JSON.stringify(corsHeaders, null, 2));
      
      if (corsHeaders['Access-Control-Allow-Origin'] === 'https://startupathon-kdu7.vercel.app') {
        console.log('  ✅ CORS properly configured');
      } else {
        console.log('  ❌ CORS not properly configured');
      }
      
    } catch (error) {
      console.log('  ❌ Error:', error.message);
      if (error.response) {
        console.log('  Status:', error.response.status);
        console.log('  Headers:', JSON.stringify(error.response.headers, null, 2));
      }
    }
    
    console.log('');
  }
}

// Run the test
testCorsHeaders().catch(console.error); 