# Server Deployment Guide for Vercel

This guide explains how to deploy the server-side of the application to Vercel.

## Prerequisites

1. A Vercel account
2. MongoDB Atlas account (or any MongoDB cloud provider)
3. Cloudinary account for file storage
4. Git repository with your code

## Environment Variables

Set the following environment variables in your Vercel project settings:

- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLIENT_URL`: URL of your frontend application
- `NODE_ENV`: Set to "production"
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

## Cloudinary Setup

1. **Create a Cloudinary Account**:
   - Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
   - After registration, you'll get your cloud name, API key, and API secret

2. **Configure Environment Variables**:
   - Add your Cloudinary credentials to your Vercel environment variables
   - These credentials are used to authenticate with Cloudinary for file uploads

3. **How It Works**:
   - When users upload files, they're sent directly to Cloudinary
   - Cloudinary returns a URL that's stored in your database
   - Files are served directly from Cloudinary's CDN, not from your server

## Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import your project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your Git repository
   - Configure the project:
     - Root Directory: `server`
     - Build Command: Leave empty (or `npm install` if needed)
     - Output Directory: Leave empty
   - Add the environment variables mentioned above
   - Click "Deploy"

3. **Verify Deployment**:
   - Once deployed, test the API endpoint: `https://your-vercel-domain.vercel.app/api/health`
   - It should return `{"status":"ok"}`

## File Uploads

Note that Vercel has a serverless architecture with an ephemeral filesystem. This means:

1. Files uploaded to the server will not persist between function invocations
2. For production, you should use a cloud storage service like:
   - AWS S3
   - Google Cloud Storage
   - Cloudinary
   - Firebase Storage

Update your file upload logic to use one of these services for production.

## Troubleshooting

- **CORS Issues**: Ensure your `CLIENT_URL` environment variable is set correctly
- **Database Connection**: Verify your MongoDB connection string and ensure your IP is whitelisted
- **Function Timeout**: Vercel has a 10-second timeout for serverless functions. Optimize slow operations
- **File Upload Issues**: Check Cloudinary credentials and ensure your account has sufficient upload quota

## Local Development

For local development:

```bash
npm install
npm run dev
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation) 