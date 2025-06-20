// src/components/Footer.jsx
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-bl from-black via-stone-950 to-green-900 text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left side: Text */}
        <p className="text-sm mb-2 md:mb-0 text-left w-full md:w-auto">
          © 2025 Made with ❤️ by Ankur Mukherjee
        </p>

        {/* Right side: Social Icons */}
        <div className="flex space-x-4 text-xl w-full md:w-auto justify-center md:justify-end">
          <a
            href="https://github.com/beingankur0073"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors duration-200"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/ankur73/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500 transition-colors duration-200"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:mukherjeeankur0073@gmail.com"
            className="hover:text-rose-400 transition-colors duration-200"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://www.instagram.com/beingankur0073/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-500 transition-colors duration-200"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/beingankur0073"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors duration-200"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
