import React from 'react';
import { FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Brand + Description + Socials */}
          <div className="flex flex-col space-y-4 items-center text-center">
            {/* Logo Image (text + logo in one image) */}
            <div>
              <img
                src="/src/assets/logo.svg"
                alt="Persist Ventures"
                className="w-60 h-auto"
              />
            </div>
            {/* Description */}
            <p className="text-lg leading-relaxed text-gray-300 mx-5">
              We partner with entrepreneurs and businesses to help scale and grow their ideas.
              With a diverse team skilled in every sector, there is no business we cannot help get a leg up.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={40} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={40} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={40} />
              </a>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col items-center text-center mt-0 md:mt-8">
            <h3 className="font-bold mb-4 text-2xl">Quick links</h3>
            <ul className="space-y-2 text-sm text-[#f5f5f586]">
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Investor Application
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Job Application
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Apply To Startup Accelerator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Career Accelerator Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Our team
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: Legal */}
          <div className="flex flex-col items-center text-center mt-0 md:mt-8">
            <h3 className="font-bold mb-4 text-2xl">Legal</h3>
            <ul className="space-y-2 text-sm text-[#f5f5f586]">
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#714AD2] duration-150 transition-colors">
                  Decentralized Intelligence Agency
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center md:text-left">
          <p className="text-sm text-gray-400">
            All rights reserved 2025 persistventures.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
