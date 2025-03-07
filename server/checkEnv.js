require('dotenv').config();

// List of required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

// Function to check if environment variables are set
function checkEnvVars() {
  console.log('Checking environment variables...');
  
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      // For sensitive variables, just log that they exist without showing the value
      if (envVar === 'MONGO_URI' || envVar === 'JWT_SECRET' || 
          envVar.includes('API_KEY') || envVar.includes('SECRET')) {
        console.log(`✓ ${envVar}: [Set but hidden for security]`);
      } else {
        console.log(`✓ ${envVar}: ${process.env[envVar]}`);
      }
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

// Run the check
const result = checkEnvVars();

// Export for use in other files
module.exports = { checkEnvVars };

// If this file is run directly
if (require.main === module) {
  if (!result) {
    console.error('Environment check failed. Please set all required variables.');
    process.exit(1);
  }
} 