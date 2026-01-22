// src/components/Footer.jsx
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-bl from-black via-stone-950 to-green-900 text-gray-300 py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Text */}
        <p className="text-sm text-center md:text-left">
          © 2025 Made with ❤️ by{" "}
          <span className="font-semibold text-white">Ankur Mukherjee</span>
        </p>

        {/* Social Icons */}
        <div className="flex items-center justify-center md:justify-end gap-5 text-xl">
          <a
            href="https://github.com/beingankur0073"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-slate-200 transition-transform duration-200 hover:scale-110"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/ankur73/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-sky-500 transition-transform duration-200 hover:scale-110"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:mukherjeeankur0073@gmail.com"
            aria-label="Email"
            className="hover:text-rose-400 transition-transform duration-200 hover:scale-110"
          >
            <FaEnvelope />
          </a>

          <a
            href="https://www.instagram.com/beingankur0073/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-rose-500 transition-transform duration-200 hover:scale-110"
          >
            <FaInstagram />
          </a>

          <a
            href="https://twitter.com/beingankur0073"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-400 transition-transform duration-200 hover:scale-110"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
