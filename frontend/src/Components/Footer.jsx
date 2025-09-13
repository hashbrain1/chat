import React from "react";
import {
  FaYoutube,
  FaDiscord,
  FaRedditAlien,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#272727] text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div id="footer">
          <p className="text-sm mb-3">Managed by</p>
          <h2 className="text-2xl font-bold text-green-400">HASH BRAIN AI</h2>
          <div className="flex gap-4 mt-4 text-xl">
            <Link
              to={"https://www.youtube.com/@HashBrainai"}
              target="_blank"
              className="hover:text-green-400"
              title="Youtube"
            >
              <FaYoutube />
            </Link>
            <Link
              to={
                "https://x.com/Hashbrainai/status/1961703826077225297?t=Ad_ZVn4nMKMko012MHPjUg&s=19"
              }
              target="_blank"
              className="hover:text-green-400"
              title="Twitter"
            >
              <FaTwitter />
            </Link>
            <Link
              to={"https://discord.gg/njrrq5Ap"}
              target="_blank"
              className="hover:text-green-400"
              title="Discord"
            >
              <FaDiscord />
            </Link>
            <Link
              to={"https://t.me/+wGZ8G1_XCx00ZGU1"}
              target="_blank"
              className="hover:text-green-400"
              title="Telegram"
            >
              <FaTelegramPlane />
            </Link>
            <Link
              to={
                "https://www.instagram.com/hashbrainai?igsh=MWtxcG9nYjAya3pvcQ=="
              }
              target="_blank"
              className="hover:text-green-400"
              title="Instagram"
            >
              <FaInstagram />
            </Link>
          </div>
          <p className="text-xs mt-4">
            © 2025 Hash Brain AI. All rights reserved.
          </p>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-white font-semibold mb-3">HASH BRAIN</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={"/whitepaper"} target="_blank" className="hover:text-green-400">
                Whitepaper
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-green-400">
                Tokenomics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-white font-semibold mb-3">GET CONNECTED</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-green-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
