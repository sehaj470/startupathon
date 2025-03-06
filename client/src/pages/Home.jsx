import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/challenges')
      .then(res => {
        console.log('Fetched challenges:', res.data);
        setChallenges(res.data);
      })
      .catch(err => {
        if (err.response) {
          // Server responded with a status other than 2xx
          console.error('Error response:', err.response.data, err.response.status);
        } else if (err.request) {
          // Request was made but no response was received
          console.error('Error request:', err.request);
        } else {
          // Something else happened in setting up the request
          console.error('General Error:', err.message);
        }
      });
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Ongoing Startupathon Challenges</h1>
      {challenges.length > 0 ? (
        <ul>
          {challenges.map(challenge => (
            <li key={challenge._id} style={{ marginBottom: '1rem' }}>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <p><strong>Funding:</strong> {challenge.funding}</p>
              <p><strong>Deadline:</strong> {new Date(challenge.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No challenges available at the moment.</p>
      )}
    </div>
  );
};

export default Home;
