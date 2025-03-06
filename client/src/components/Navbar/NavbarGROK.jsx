import React, { useState, useEffect } from "react";
import "./Navbar.css";
// import FellowshipApplication from "../FellowshipApplication/FellowshipApplication";
import { useNavigate } from "react-router-dom";

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
          src="src\assets\logo.svg"
          alt="Persist Startupathon"
          className="h-10 w-35"
        />
        {/* If your SVG does not include the text "PERSIST STARTUPATHON", uncomment the line below */}
        {/* <span className="text-white ml-2">PERSIST STARTUPATHON</span> */}
      </div>
      <div className="flex items-center space-x-5 ml-7 ">
        <a
          href="#"
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection("ongoingStartupthonRef"); 
          }}
          className="text-white transition-colors duration-200 hover:text-purple-600"
        >
          Ongoing Startupathon
        </a>
        <a
          href="#"
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection("completedStartupthonRef"); 
          }}
          className="text-white transition-colors duration-200 hover:text-purple-600"
        >
          Completed Startupathon
        </a>
        <a
          href="#"
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection("startupthonGuideRef"); 
          }}
          className="text-white transition-colors duration-200 hover:text-purple-600"
        >
          Startupathon Guide
        </a>
        <a
          href="#"
          className="text-white transition-colors duration-200 hover:text-purple-600"
        >
          How To Win
        </a>
        <a
          href="#"
          className="text-white transition-colors duration-200 hover:text-purple-600"
        >
          Mentor Network
        </a>
        <button
          onClick={handleApplyClick}
          className="bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn transition-colors duration-200 hover:bg-[#855DEF] h-[48px] flex items-center justify-center"
        >
          Apply For Fellowship
        </button>

          


      </div>
    </nav>
    
    {/* Mobile Navbar */}
    <nav className="min-[1001px]:hidden  bg-black justify-between items-center px-5 py-5 w-full opacity-90 fixed z-10">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          src="src/assets/logo.svg"
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

      {/* Menu Overlay */}
      {isOpen && (
          <div className="fixed left-0 w-full h-screen z-20 top-[88px]">
          {/* Animated Menu Panel (Top Half) */}
          <div
            className={`absolute top-0 left-0 w-full h-[500px] bg-black z-30
              flex flex-col justify-center items-center space-y-8
              transform transition-transform duration-300 ease-out
              ${animateMenu ? "translate-y-0" : "-translate-y-full"}`}
          >
            <a
              href="#"
              className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                scrollToSection("ongoingStartupthonRef");
              }}
            >
              Ongoing Startupathon
            </a>
            <a
              href="#"
              className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
              onClick={(e) => { 
                closeMenu();
                e.preventDefault(); 
                scrollToSection("completedStartupthonRef"); 
              }}
            >
              Completed Startupathon
            </a>
            <a
              href="#"
              className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
              onClick={(e) => { 
                closeMenu();
                e.preventDefault(); 
                scrollToSection("startupthonGuideRef"); 
              }}
            >
              Startupathon Guide
            </a>
            <a
              href="#"
              className="text-white text-xl hover:text-purple-600 transition-colors duration-200"
              onClick={closeMenu}
            >
              How It Works
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
                className=" bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn
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
      )}
    </nav>
    </>
  );
};

export default NavbarGROK;
