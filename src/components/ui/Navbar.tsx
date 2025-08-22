import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-green-700">FreshFlow</div>
      <div className="space-x-6 text-sm font-medium">
        <Link to="/manager-dashboard" className="text-gray-700 hover:text-green-700">
          Manager Dashboard
        </Link>
        <Link to="/feedback" className="text-gray-700 hover:text-green-700">
          Write a Feedback
        </Link>
        <Link to="/staff-management" className="text-gray-700 hover:text-green-700">
          Staff Management
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
