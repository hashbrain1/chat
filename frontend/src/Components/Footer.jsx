import { Instagram, Linkedin, Twitter,Send } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white  shadow-sm  dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025{" "}
          <a className="hover:underline">
            Hash Brain
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex gap-3 items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link to={""} className="hover:underline me-4 md:me-6">
              <Instagram/>
            </Link>
          </li>
          <li>
             <Link to={""} className="hover:underline me-4 md:me-6">
              <Twitter/>
            </Link>
          </li>
          <li>
            <Link to={""} className="hover:underline me-4 md:me-6">
              <Send/>
            </Link>
          </li>
          <li>
           <Link to={""} className="hover:underline me-4 md:me-6">
              <Linkedin/>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
