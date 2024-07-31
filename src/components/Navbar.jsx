import logo from "../assets/zain.jpeg";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        <img src={logo} alt="" className="mx-2 w-16 rounded-full" />
      </div>

      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <a
          target="_blank"
          href="https://www.linkedin.com/in/muhammad-zain-afzal-649209227/"
        >
          <FaLinkedin />
        </a>
        <a href="https://github.com/sheikhmuhammadzain" target="_blank">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/zainshayykh/" target="_blank">
          <FaInstagram />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
