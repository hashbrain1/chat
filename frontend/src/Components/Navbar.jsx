import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-5 left-0 w-full z-50 px-4 sm:px-6">
      <div className="flex justify-between items-center px-4 py-2 max-w-7xl mx-auto bg-white rounded-full">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          {/* <div className="bg-white rounded-full p-2">
            <span className="text-green-600 font-bold">∞</span>
          </div> */}
          <div className="w-10 h-10">
            <img
              src="/Images/logo.png"
              alt=""
              className="[clip-path:circle(50%_at_50%_50%)]"
            />
          </div>
        </div>

        {/* Menu Icon for Mobile */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Navigation Links */}

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent rounded-b-xl md:rounded-none shadow-md md:shadow-none px-4 sm:px-6 py-4 md:p-0 space-y-4 md:space-y-0 md:space-x-6 items-center`}
        >
          <Link to={"/"} className="text-black hover:text-gray-700">
            Home
          </Link>
          <a href="#" className="text-black hover:text-gray-700">
            Docs
          </a>
          <a href="#" className="text-black hover:text-gray-700">
            Ecosystem
          </a>
          <Link
            to={"/chat"}
            className="text-black bg-[rgb(151,252,228)] hover:bg-green-500 rounded-full px-4 py-2 text-center"
          >
            Chat Ai
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
