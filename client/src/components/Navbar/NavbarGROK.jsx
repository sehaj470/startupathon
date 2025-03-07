import React, { useState, useEffect } from "react";
import "./Navbar.css";
// import FellowshipApplication from "../FellowshipApplication/FellowshipApplication";
import { useNavigate } from "react-router-dom";
import logoSvg from "/src/assets/logo.svg"; // Import the logo directly

const NavbarGROK = ({ scrollToSection  }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);

  const handleApplyClick = () => {
    navigate("/apply");
  };

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setAnimateMenu(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300); // Duration must match the transition duration
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
    }
  };

  // When the menu is rendered, trigger the slide-down animation
  useEffect(() => {
    if (isOpen) {
      // Using a timeout ensures the element is rendered before starting the animation
      setTimeout(() => {
        setAnimateMenu(true);
      }, 0);
    }
  }, [isOpen]);
  
  return (
    <>
      <div className="bg-[#0A0111] px11 py-6  w-full h-22 absolute"></div>
      <nav className="hidden bg-black min-[1001px]:flex justify-between items-center px-11 py-6 w-full opacity-90 fixed z-10">
        <div className="flex items-center">
          <img
            src={logoSvg}
            alt="Persist Startupathon"
            className="h-10 w-35"
          />
          {/* If your SVG does not include the text "PERSIST STARTUPATHON", uncomment the line below */}
          {/* <span className="text-white ml-2">PERSIST STARTUPATHON</span> */}
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8">
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-200"
            onClick={() => scrollToSection('ongoingStartupthonRef')}
          >
            Ongoing Startupathon
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-200"
            onClick={() => scrollToSection('completedStartupthonRef')}
          >
            Completed Startupathon
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-200"
            onClick={() => scrollToSection('startupthonGuideRef')}
          >
            Startupathon Guide
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-200"
          >
            How To Win
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-200"
          >
            Mentor Network
          </a>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyClick}
          className="bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn
                    transition-colors duration-200 hover:bg-[#855DEF]
                    h-[48px] flex items-center justify-center"
        >
          Apply For Fellowship
        </button>
      </nav>
      
      {/* Mobile Navbar */}
      <nav className="min-[1001px]:hidden  bg-black justify-between items-center px-5 py-5 w-full opacity-90 fixed z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
            src={logoSvg}
            alt="Persist Startupathon"
            className="h-7 w-30"
          />
          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="bg-[#7A56D6] text-white rounded-full w-14 h-14 flex items-center justify-center hover:bg-[#824BF1] focus:outline-none focus:opacity-75 focus:bg-[#824BF1]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
            {/* Menu Container */}
            <div
              className={`absolute top-0 right-0 w-full h-screen bg-[#0A0111] transform transition-transform duration-300 ease-in-out ${
                animateMenu ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Close Button */}
              <div className="flex justify-end p-5">
                <button
                  onClick={closeMenu}
                  className="text-white hover:text-purple-600 focus:outline-none"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex flex-col items-center space-y-8 mt-10">
                <a
                  href="#"
                  className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
                  onClick={() => {
                    closeMenu();
                    scrollToSection('ongoingStartupthonRef');
                  }}
                >
                  Ongoing Startupathon
                </a>
                <a
                  href="#"
                  className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
                  onClick={() => {
                    closeMenu();
                    scrollToSection('completedStartupthonRef');
                  }}
                >
                  Completed Startupathon
                </a>
                <a
                  href="#"
                  className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
                  onClick={() => {
                    closeMenu();
                    scrollToSection('startupthonGuideRef');
                  }}
                >
                  Startupathon Guide
                </a>
                <a
                  href="#"
                  className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
                  onClick={closeMenu}
                >
                  How To Win
                </a>
                <a
                  href="#"
                  className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Mentor Network
                </a>
                <button
                  onClick={() => {
                    closeMenu();
                    handleApplyClick();
                  }}
                  className="bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn
                            transition-colors duration-200 hover:bg-[#855DEF]
                            h-[48px] flex items-center justify-center"
                >
                  Apply For Fellowship
                </button>
              </div>

              {/* Lower Half Overlay (Click anywhere to close) */}
              <div
                className="absolute bottom-0 left-0 w-full h-1/2 z-20"
                onClick={closeMenu}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavbarGROK;
