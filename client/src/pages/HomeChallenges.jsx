import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const HomeChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_ENDPOINTS.CHALLENGES)
      .then((res) => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching challenges:', err);
        setError('Failed to load challenges. Please try again later.');
        setLoading(false);
      });
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80';
    
    // Check if the image path is already a full URL (Cloudinary)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Extract the base URL from the API_ENDPOINTS
    const baseUrl = API_ENDPOINTS.CHALLENGES.split('/api')[0];
    // Fallback for local development
    return `${baseUrl}/uploads/challenges/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#0A0111] to-black min-h-screen py-12 font-sans flex items-center justify-center">
        <div className="text-white text-xl">Loading challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#0A0111] to-black min-h-screen py-12 font-sans flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0A0111] to-black min-h-screen py-12 font-sans">
      {/* Page Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-2">
        Ongoing Startupathon Challenges
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto px-4 text-center text-lg text-gray-200 italic mb-8 opacity-75">
        Start your journey—tackle live challenges, earn equity, and lead the future.
      </p>

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto px-4">
        {challenges.length === 0 ? (
          <div className="text-center text-white text-xl py-10">
            No active challenges at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
            {challenges.map((challenge) => (
              <div
                key={challenge._id}
                className="
                  bg-[#12011F]
                  rounded-lg
                  p-6
                  flex flex-col
                  items-center
                  text-center
                  w-[400px]
                  h-[450px]
                  mx-auto
                  shadow-sm
                  border border-[#3A2A4D]
                  transition-all duration-300
                  hover:bg-[#100421]
                  hover:shadow-[0_0_8px_#876AD1]
                "
              >
                {/* Fixed-Size Image (80×80) */}
                <div className="w-20 h-20 mb-4 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={getImageUrl(challenge.image)}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {challenge.title}
                </h2>

                {/* Funding */}
                <p className="text-base text-[#714EC4] font-bold mb-1">
                  Initial Funding Offered: {challenge.funding}
                </p>

                {/* Description (limit to 3 lines) */}
                <p className="
                  text-sm text-gray-200
                  mb-4 mt-4 px-2
                  line-clamp-3
                  overflow-hidden
                  text-ellipsis
                  flex-grow
                ">
                  {challenge.description}
                </p>

                {/* Deadline */}
                <p className="w-[95%] mx-auto text-base text-[#714EC4] font-semibold mb-4 flex items-center justify-center">
                  <span className="material-icons text-base">&#x23F0;</span>
                  <span className="ml-1">
                    Deadline approaching! Apply by{' '}
                    {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                </p>

                {/* Action Button pinned at bottom */}
                <button
                  className="
                    bg-[#7F5ED5]
                    text-white
                    rounded-md
                    px-4
                    py-2
                    apply-fellowship-btn
                    transition-colors
                    duration-200
                    hover:bg-[#855DEF]
                    flex
                    items-center
                    justify-center
                    mt-auto
                  "
                  style={{ width: '100%', height: '40px' }}
                >
                  View Challenge Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeChallenges;
