# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Startupathon Client

This is the frontend application for the Startupathon project.

## Deployment to Vercel

### Prerequisites

1. A Vercel account
2. Your backend API deployed to Vercel or another hosting service
3. Git repository with your code

### Environment Variables

Create a `.env` file based on the `.env.example` template and set the following variables:

```
VITE_API_URL=https://your-backend-api-url.vercel.app
```

Replace `https://your-backend-api-url.vercel.app` with the actual URL of your deployed backend API.

### Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import your project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your Git repository
   - Configure the project:
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add the environment variables mentioned above
   - Click "Deploy"

3. **Verify Deployment**:
   - Once deployed, test your application by visiting the Vercel URL
   - Ensure all features work correctly, especially API calls and image loading

## File Upload Changes

The application has been updated to work with Cloudinary for file uploads. Key changes include:

1. **File Validation**:
   - Only image files are allowed
   - Maximum file size is 3MB
   - Validation is performed client-side before upload

2. **API Configuration**:
   - All API endpoints are now configured in `src/config/api.js`
   - The application automatically detects Cloudinary URLs vs. local file paths

## Local Development

For local development:

```bash
npm install
npm run dev
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
