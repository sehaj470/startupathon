import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompleterDetails = () => {
  const [completer, setCompleter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompleter = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/completers/${id}`);
        if (!res.data.visible) {
          navigate('/'); // Redirect if not visible
          return;
        }
        setCompleter(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching completer:', err);
        setError('Failed to load completer details');
        setLoading(false);
      }
    };

    fetchCompleter();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0111] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error || !completer) {
    return (
      <div className="min-h-screen bg-[#0A0111] flex items-center justify-center text-white">
        {error || 'Completer not found'}
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    return `http://localhost:5000/uploads/completers/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0111] py-30 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          {completer.projectName}
        </h1>

        <div className="py-30 bg-[#1E0635] rounded-lg p-8 shadow-lg border border-[#8B6FD0]">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3">
              <img
                src={getImageUrl(completer.profilePicture)}
                alt={completer.profile}
                className="w-full h-[400px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
            </div>

            <div className="w-full md:w-2/3 ">
              <h2 className="text-2xl font-bold text-white mb-2">
                {completer.profile}
              </h2>
              <p className="text-xl text-purple-400 mb-4">{completer.position}</p>
              
              {completer.linkedinUrl && (
                <a
                  href={completer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5d268d] text-white px-4 py-2 rounded hover:bg-[#eeddffbb] hover:text-[#5d268d] transition-colors mb-20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Initial Funding Received:
                </h3>
                <p className="text-2xl text-purple-400 font-bold">
                  {completer.funding}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  About the Journey:
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {completer.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleterDetails;