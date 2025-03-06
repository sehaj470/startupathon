import React from "react";

const NavbarGPT = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4">
      {/* Left section: Logo + Brand Name */}
      <div className="flex items-center space-x-3">
        {/* Replace src with your SVG file path and adjust width/height as needed */}
        <img
          src="src\assets\logo.svg"
          alt="Logo"
          className="h-8 w-35" 
        />
        {/* <span className="text-white font-bold text-xl">PERSIST</span> */}
      </div>

      {/* Middle section: Navigation Links */}
      <div className="flex items-center space-x-6">
        <a href="#" className="text-gray-300 hover:text-purple-500">
          StartApplication
        </a>
        <a href="#" className="text-gray-300 hover:text-purple-500">
          CompletedStartApplication
        </a>
        <a href="#" className="text-gray-300 hover:text-purple-500">
          StartApplicationGuide
        </a>
        <a href="#" className="text-gray-300 hover:text-purple-500">
          HowToWin
        </a>
        <a href="#" className="text-gray-300 hover:text-purple-500">
          MentorMentor
        </a>
      </div>

      {/* Right section: "ApplyForPartnership" Button */}
      <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        ApplyForPartnership
      </button>
    </nav>
  );
};

export default NavbarGPT;
