import logo from "../assets/zain.jpeg";
import { HugeiconsIcon } from "@hugeicons/react";
import { Linkedin01Icon, GithubIcon, InstagramIcon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="mb-10 sm:mb-20 flex items-center justify-between py-4 sm:py-6">
      <div className="flex flex-shrink-0 items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Muhammad Zain - Gen-AI Engineer Logo"
            className="w-10 sm:w-16 rounded-full cursor-pointer hover:scale-110 transition-transform"
            width="1024"
            height="1024"
            loading="eager"
            decoding="async"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl">
        <a
          href="https://zainshaykh.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center rounded-lg sm:rounded-xl p-px text-xs sm:text-sm font-medium text-neutral-100 transition-all duration-200 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.6) inset, 0 1px 2px 0 rgba(0,0,0,0.5)",
          }}
        >
          <span
            className="rounded-[7px] sm:rounded-[11px] px-2.5 sm:px-4 py-1 sm:py-1.5 transition-colors duration-200 group-hover:brightness-110"
            style={{
              background:
                "linear-gradient(180deg, #1f1f24 0%, #131316 100%)",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 -2px 6px 0 rgba(0,0,0,0.4) inset",
            }}
          >
            Portfolio 2
          </span>
        </a>
        <Link to="/blogs" className="text-sm sm:text-lg font-medium hover:text-neutral-300 transition-colors">
          Blogs
        </Link>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/muhammad-zain-afzal-649209227/"
          aria-label="Visit Muhammad Zain's LinkedIn profile"
        >
          <HugeiconsIcon icon={Linkedin01Icon} size={24} strokeWidth={1.8} className="hover:text-neutral-300 transition-colors" />
        </a>
        <a
          href="https://github.com/sheikhmuhammadzain"
          target="_blank"
          aria-label="Visit Muhammad Zain's GitHub profile"
        >
          <HugeiconsIcon icon={GithubIcon} size={24} strokeWidth={1.8} className="hover:text-neutral-300 transition-colors" />
        </a>
        <a
          href="https://www.instagram.com/zainshayykh/"
          target="_blank"
          aria-label="Visit Muhammad Zain's Instagram profile"
        >
          <HugeiconsIcon icon={InstagramIcon} size={24} strokeWidth={1.8} className="hover:text-neutral-300 transition-colors" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
