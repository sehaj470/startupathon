// client/src/pages/Admin/FoundersAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FoundersAdmin = () => {
  const [founders, setFounders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('/api/admin/founders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setFounders(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div>
      <h2>Founders Management</h2>
      <button>Add Founder</button> {/* You can later open a form modal for adding a founder */}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Profile</th>
            <th>Position</th>
            <th>Location</th>
            <th>Bio Highlights</th>
            <th>Languages</th>
            <th>Regional Expertise</th>
            <th>Tech Expertise</th>
            <th>Buisness Expertise</th>
            <th>Social Links</th>
          </tr>
        </thead>
        <tbody>
          {founders.map((founder, index) => (
            <tr key={founder._id}>
              <td>{index + 1}</td>
              <td>{founder.profile}</td>
              <td>{founder.position}</td>
              <td>{founder.location}</td>
              <td>{founder.bio_highlights}</td>
              <td>{founder.languages}</td>
              <td>{founder.regional_expertise}</td>
              <td>{founder.tech_expertise}</td>
              <td>{founder.buisness_expertise}</td>
              <td>{founder.social_links}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoundersAdmin;
