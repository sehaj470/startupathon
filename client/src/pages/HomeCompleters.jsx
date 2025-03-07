import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getImageUrl } from '../config/api';

const HomeCompleters = () => {
  const navigate = useNavigate();
  const [completers, setCompleters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompleters = async () => {
      try {
        setLoading(true);
        console.log('Fetching completers from:', API_ENDPOINTS.COMPLETERS);
        const res = await axios.get(API_ENDPOINTS.COMPLETERS);
        console.log('Completers data received:', res.data);
        setCompleters(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching completers:', err);
        setError('Failed to load completers');
      } finally {
        setLoading(false);
      }
    };

    fetchCompleters();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0A0111] min-h-screen py-8 text-white text-center font-sans">
        Loading completers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0A0111] min-h-screen py-8 text-white text-center font-sans">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-[#0A0111] min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Startupathon Completers
        </h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Meet the founders who successfully completed our challenges and are now building the future.
        </p>

        {completers.length === 0 ? (
          <div className="text-center text-white py-10">
            No completers to display yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completers.map((completer) => (
              <div
                key={completer._id}
                className="bg-[#1A0B2E] rounded-lg overflow-hidden shadow-lg border border-[#3A2A4D] hover:shadow-[0_0_15px_rgba(135,106,209,0.5)] transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/completers/${completer._id}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={getImageUrl(completer.image, 'completers')}
                    alt={completer.projectName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{completer.projectName}</h2>
                  <p className="text-gray-300 mb-4">{completer.position}</p>
                  <p className="text-gray-400 line-clamp-3">{completer.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeCompleters;
