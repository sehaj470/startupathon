import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getImageUrl, apiRequest } from '../config/api';

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
        
        const data = await apiRequest('get', API_ENDPOINTS.COMPLETERS);
        console.log('Completers data received:', data);
        
        setCompleters(data);
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
    <div className="bg-black py-12 font-sans">
      {/* Page Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-2">
        Completed Startupathon Challenges
      </h1>
      {/* Subtitle */}
      <p className="text-center text-lg text-gray-300 italic mb-8 opacity-85 mx-4.5">
        People like you have cracked Startupathon challenges and are now leading thriving startups.
      </p>

      {/* Completers Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {completers.length === 0 ? (
          <div className="text-center text-white py-10">
            No completers to display yet. Check back soon!
          </div>
        ) : (
          /* Grid: 1 column on small, 2 on md, 3 on lg */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completers.map((completer) => (
              <div
                key={completer._id}
                className="
                  bg-[#1E0635]
                  rounded-lg
                  p-4
                  w-full
                  transition-colors
                  hover:bg-[#19052d]
                  flex
                  flex-col
                  border
                  border-[#8B6FD0]
                "
              >
                {/* Project Name */}
                <h2 className="text-3xl font-semibold text-white mb-4">
                  {completer.projectName}
                </h2>

                {/* Two-Column Layout: always side-by-side */}
                <div className="flex flex-row flex-grow gap-4">
                  {/* Left Column: image */}
                  <div className="w-1/2 flex flex-col items-center">
                    {/* Fixed height container with absolute-positioned image */}
                    <div className="relative w-full h-42">
                      <img
                        src={getImageUrl(completer.profilePicture, 'completers')}
                        alt={completer.profile}
                        className="absolute w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200';
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Profile/Position/LinkedIn/Description */}
                  <div className="w-1/2 flex flex-col">
                    {/* Name & Position */}
                    <h3 className="text-lg font-bold text-white">
                      {completer.profile}
                    </h3>
                    <p className="text-gray-300">{completer.position}</p>

                    {/* LinkedIn Icon */}
                    <div className="mt-2">
                      <a
                        href={completer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          w-7 h-7
                          rounded-lg
                          bg-[#7745f5]
                          hover:bg-blue-500
                          transition-colors
                        "
                      >
                        {/* LinkedIn 'in' SVG icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                          className="w-4 h-4 text-white"
                        >
                          <path d="M100.28 448H7.4V149.5h92.88zM53.79 108.1a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.34-79.3-48.4 0-55.8 37.8-55.8 76.7V448H158V149.5h89V185h1.3c12.4-23.5 42.6-48.3 87.7-48.3 93.9 0 111.1 61.8 111.1 142.3V448z" />
                        </svg>
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mt-3 line-clamp-3">
                      {completer.description}
                    </p>
                  </div>
                </div>

                {/* Funding (below the 2-column layout) */}
                <p className="mt-3 text-md font-bold text-white">
                  Initial Funding Offered:
                  <span className="ml-1 italic text-[#714EC4] font-bold">
                    {completer.funding}
                  </span>
                </p>

                {/* View More Details Button - Full Width */}
                <button
                  onClick={() => navigate(`/completers/${completer._id}`)}
                  className="
                    bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn transition-colors duration-200 hover:bg-[#855DEF] h-[40px] flex items-center justify-center mt-2 
                  "
                  style={{width: '100%'}}
                >
                  View More Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeCompleters;
