import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { Calendar } from 'lucide-react';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition shadow-lg">
  <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
</div>
<span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
  SlotSwapper
</span>
          </Link>

          {/* Navigation Links */}
          {token ? (
            <>
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/" active={loc.pathname === '/'}>
                  My Calendar
                </NavLink>
                <NavLink to="/marketplace" active={loc.pathname === '/marketplace'}>
                  Marketplace
                </NavLink>
                <NavLink to="/requests" active={loc.pathname === '/requests'}>
                  Requests
                </NavLink>
              </div>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                  onClick={() => { logout(); nav('/login'); }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition bg-gray-200 hover:bg-gray-300 rounded-lg"
                to="/login"
              >
                Login
              </Link>
              <Link 
                className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow-md"
                to="/signup"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}