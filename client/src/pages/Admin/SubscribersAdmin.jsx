import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubscribersAdmin = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      throw new Error('No token found');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchSubscribers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/subscribers?page=${page}&search=${search}`,
        getAuthConfig()
      );
      setSubscribers(res.data.subscribers);
      setTotalPages(res.data.totalPages);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
      setError('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/subscribers',
        formData,
        getAuthConfig()
      );
      setSubscribers([...subscribers, res.data]);
      setFormData({ email: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add subscriber');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/subscribers/${id}`,
          getAuthConfig()
        );
        fetchSubscribers(currentPage, searchTerm);
      } catch (err) {
        setError('Failed to delete subscriber');
      }
    }
  };

  return (
    <div className="p-6 bg-[#0A0111] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Subscribers</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF] transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add New Subscriber'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#1c0c2e] p-6 rounded-lg mb-6">
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#7F5ED5] text-white px-4 py-2 rounded hover:bg-[#855DEF]"
          >
            Add Subscriber
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Subscribers Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-[#1c0c2e] rounded-lg overflow-hidden">
          <thead className="bg-[#2d1645]">
            <tr>
              <th className="px-6 py-3 text-left">S.No</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Date Subscribed</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr key={subscriber._id} className="border-t border-[#3d2157]">
                <td className="px-6 py-4">{(currentPage - 1) * 10 + index + 1}</td>
                <td className="px-6 py-4">{subscriber.email}</td>
                <td className="px-6 py-4">
                  {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(subscriber._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-[#7F5ED5] text-white'
                : 'bg-[#1c0c2e] text-gray-300 hover:bg-[#2d1645]'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubscribersAdmin;