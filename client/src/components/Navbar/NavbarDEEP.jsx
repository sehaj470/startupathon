import React from 'react';

const NavbarDEEP = () => {
  return (
    <nav className="bg-gray-900 shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Replace src with your actual SVG path */}
        <div className="flex items-center">
          <img 
            src="src\assets\logo.svg" 
            alt="PERSIST Logo" 
            className="h-8 w-32" // Adjust height/width as needed
          />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 items-center">
          <div className="flex space-x-8">
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                Ongoing Startupathon
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                Completed Startupathon
              </a>
            </div>
            
            <div className="border-l h-6 border-gray-200"></div>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                Startupathon Guide
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                How To Win
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                Mentor Network
              </a>
            </div>
          </div>

          <a 
            href="#" 
            className="ml-4 text-gray-600 hover:text-purple-600 transition-colors duration-300"
          >
            Apply For Fellowship
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDEEP;