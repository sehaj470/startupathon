import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChallengesAdmin from './ChallengesAdmin';
import FoundersAdmin from './FoundersAdmin';
import CompletersAdmin from './CompletersAdmin';
import SubscribersAdmin from './SubscribersAdmin';
import RequireAdmin from './RequireAdmin';

const AdminLayout = () => {
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

    // Add token verification
    const verifyToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return false;
      }
      return true;
    };

    const handleNavigation = (path) => {
      if (verifyToken()) {
        navigate(`/admin/${path}`);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0A0111]">
      {/* Sidebar */}
      <nav className="w-64 bg-[#1c0c2e] p-6">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleNavigation('challenges')}
              className="w-full text-center text-white hover:text-purple-400 py-2 px-4 rounded transition-colors mt-8 text-2xl cursor-pointer"
            >
              CHALLENGES
            </button>
          </li>
          {/* <li>
            <button
              onClick={() => handleNavigation('founders')}
              className="w-full text-center text-white hover:text-purple-400 py-2 px-4 rounded transition-colors"
            >
              FOUNDERS
            </button>
          </li> */}
          <li>
            <button
              onClick={() => handleNavigation('completers')}
              className="w-full text-center text-white hover:text-purple-400 py-2 px-4 rounded transition-colors text-2xl cursor-pointer"
            >
              COMPLETERS
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('subscribers')}
              className="w-full text-center text-white hover:text-purple-400 py-2 px-4 rounded transition-colors text-2xl cursor-pointer"
            >
              SUBSCRIBERS
            </button>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="w-full text-center  text-white hover:text-red-400 hover:bg-[#b4636329] py-2 px-4 rounded transition-colors mt-96 font-bold text-2xl cursor-pointer"
        >
          LOGOUT
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route
            path="challenges"
            element={<RequireAdmin><ChallengesAdmin /></RequireAdmin>}
          />
          <Route
            path="founders"
            element={<RequireAdmin><FoundersAdmin /></RequireAdmin>}
          />
          <Route
            path="completers"
            element={<RequireAdmin><CompletersAdmin /></RequireAdmin>}
          />
          <Route
            path="subscribers"
            element={<RequireAdmin><SubscribersAdmin /></RequireAdmin>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;