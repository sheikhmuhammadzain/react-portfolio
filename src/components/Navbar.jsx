import logo from "../assets/zain.jpeg";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        <img 
          src={logo} 
          alt="Muhammad Zain - Gen-AI Engineer Logo" 
          className="mx-2 w-16 rounded-full" 
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
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
