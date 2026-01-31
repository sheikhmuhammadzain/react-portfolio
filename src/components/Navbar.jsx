import logo from "../assets/zain.jpeg";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        <Link to="/">
          <img 
            src={logo} 
            alt="Muhammad Zain - Gen-AI Engineer Logo" 
            className="mx-2 w-16 rounded-full cursor-pointer hover:scale-110 transition-transform" 
            loading="eager"
            decoding="async"
          />
        </Link>
      </div>

      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <Link to="/blogs" className="text-lg font-medium hover:text-purple-400 transition-colors mr-4">
          Blogs
        </Link>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/muhammad-zain-afzal-649209227/"
          aria-label="Visit Muhammad Zain's LinkedIn profile"
        >
          <FaLinkedin />
        </a>
        <a 
          href="https://github.com/sheikhmuhammadzain" 
          target="_blank"
          aria-label="Visit Muhammad Zain's GitHub profile"
        >
          <FaGithub />
        </a>
        <a 
          href="https://www.instagram.com/zainshayykh/" 
          target="_blank"
          aria-label="Visit Muhammad Zain's Instagram profile"
        >
          <FaInstagram />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
