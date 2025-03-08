import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl, apiRequest } from '../config/api';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const CompleterDetails = () => {
  const [completer, setCompleter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompleter = async () => {
      try {
        console.log('Fetching completer details from:', `${API_ENDPOINTS.COMPLETERS}/${id}`);
        
        // Use apiRequest instead of axios directly to ensure consistent URL handling
        const data = await apiRequest('get', `${API_ENDPOINTS.COMPLETERS}/${id}`);
        
        console.log('Completer data received:', data);
        
        if (!data || (data.visible === false)) {
          console.log('Completer not visible or not found, redirecting to home');
          navigate('/');
          return;
        }
        
        setCompleter(data);
      } catch (err) {
        console.error('Error fetching completer:', err);
        setError('Failed to load completer details');
      } finally {
        setLoading(false);
      }
    };

    fetchCompleter();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0111] flex items-center justify-center text-white">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (error || !completer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0111] flex items-center justify-center text-white">
          {error || 'Completer not found'}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0111] py-12 px-4">
        <div className="max-w-4xl mx-auto bg-[#1E0635] rounded-lg overflow-hidden shadow-xl border border-[#8B6FD0]">
          {/* Header with image */}
          <div className="h-64 relative">
            <img
              src={getImageUrl(completer.profilePicture, 'completers')}
              alt={completer.projectName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x400';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0111] to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-bold text-white">{completer.projectName}</h1>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Founder</h2>
              <p className="text-gray-300">{completer.profile}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Position</h2>
              <p className="text-gray-300">{completer.position}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Initial Funding</h2>
              <p className="text-[#714EC4] font-bold">{completer.funding}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About the Project</h2>
              <p className="text-gray-300 whitespace-pre-line">{completer.description}</p>
            </div>
            
            {completer.linkedinUrl && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Connect</h2>
                <a
                  href={completer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#7F5ED5] text-white px-4 py-2 rounded-md hover:bg-[#855DEF] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                    className="w-4 h-4"
                  >
                    <path d="M100.28 448H7.4V149.5h92.88zM53.79 108.1a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.34-79.3-48.4 0-55.8 37.8-55.8 76.7V448H158V149.5h89V185h1.3c12.4-23.5 42.6-48.3 87.7-48.3 93.9 0 111.1 61.8 111.1 142.3V448z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            )}
            
            <button
              onClick={() => navigate('/completers')}
              className="bg-[#7F5ED5] text-white px-6 py-2 rounded-md hover:bg-[#855DEF] transition-colors"
            >
              Back to Completers
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompleterDetails;