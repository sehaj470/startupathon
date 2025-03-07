const axios = require('axios');

/**
 * Test script to verify CORS headers on local server
 * Run with: node cors-test-local.js
 */

const BASE_URL = 'http://localhost:5000';
const TEST_ENDPOINTS = [
  '/api/health',
  '/api/db-status',
  '/api/challenges',
  '/api/completers',
  '/api/subscribers',
  '/api/diagnostics/system'
];

// Function to check CORS headers on local server
async function testLocalCorsHeaders() {
  console.log('Testing CORS headers on local server endpoints...\n');
  
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
      console.log('  Making OPTIONS request...');
      const optionsResponse = await axios({
        method: 'OPTIONS',
        url: url,
        headers: config.headers
      });
      
      // Check CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': optionsResponse.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': optionsResponse.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': optionsResponse.headers['access-control-allow-headers']
      };
      
      console.log('  OPTIONS Status:', optionsResponse.status);
      console.log('  CORS Headers:', JSON.stringify(corsHeaders, null, 2));
      
      const originHeader = corsHeaders['Access-Control-Allow-Origin'];
      if (originHeader === 'https://startupathon-kdu7.vercel.app' || originHeader === '*') {
        console.log('  ✅ CORS preflight check passed');
      } else {
        console.log('  ❌ CORS preflight check failed');
      }
      
      // Make actual GET request
      console.log('  Making GET request...');
      const response = await axios.get(url, config);
      
      console.log('  GET Status:', response.status);
      console.log('  ✅ GET request successful');
      
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
testLocalCorsHeaders().catch(console.error); 