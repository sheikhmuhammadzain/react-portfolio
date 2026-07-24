import { HERO_CONTENT, LIVE_CALL_EVENT, RESUME_FILENAME } from "../constants";
import { downloadResume } from "../utils/downloadResume";
import profilePic from "../assets/winterdp.jpg";
import resume from "../assets/resume/my_resume-zain.pdf";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons/core-free-icons";

// Skeuomorphic pill button, shared by both hero CTAs
const BUTTON_SHELL_CLASS =
  "group relative inline-flex w-fit items-center rounded-xl p-px text-sm font-medium text-neutral-100 transition-all duration-200 active:scale-[0.98]";
const BUTTON_SHELL_STYLE = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
  boxShadow:
    "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.6) inset, 0 1px 2px 0 rgba(0,0,0,0.5)",
};
const BUTTON_INNER_CLASS =
  "flex items-center gap-2 rounded-[11px] px-6 py-3 transition-colors duration-200 group-hover:brightness-110";
const BUTTON_INNER_STYLE = {
  background: "linear-gradient(180deg, #1f1f24 0%, #131316 100%)",
  boxShadow: "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 -2px 6px 0 rgba(0,0,0,0.4) inset",
};

const Hero = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 mb-16">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col items-center lg:items-start">
            <h1
              className="hero-fade-up pb-8 text-6xl font-thin tracking-tight lg:mt-16
                lg:text-8xl max-sm:text-center"
            >
              Muhammad Zain
            </h1>

            <span
              className="hero-fade-up bg-gradient-to-r from-white via-neutral-400 to-neutral-600 bg-clip-text text-3xl tracking-tight text-transparent"
              style={{ animationDelay: "0.2s" }}
            >
              Full Stack AI Developer
            </span>

            <div
              className="hero-fade-up flex flex-col items-center lg:items-start gap-8"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="my-2 max-w-xl py-6 font-light tracking-tighter">
                {HERO_CONTENT}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 md:mb-0">
                <a
                  href={resume}
                  download={RESUME_FILENAME}
                  onClick={(e) => { e.preventDefault(); downloadResume(); }}
                  className={BUTTON_SHELL_CLASS}
                  style={BUTTON_SHELL_STYLE}
                >
                  <span className={BUTTON_INNER_CLASS} style={BUTTON_INNER_STYLE}>
                    <HugeiconsIcon icon={Download04Icon} size={18} strokeWidth={1.8} /> Download Resume
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent(LIVE_CALL_EVENT))}
                  className={BUTTON_SHELL_CLASS}
                  style={BUTTON_SHELL_STYLE}
                >
                  <span className={BUTTON_INNER_CLASS} style={BUTTON_INNER_STYLE}>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-300 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-400" />
                    </span>
                    Talk to My Agent
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-fade-left w-full lg:w-1/2 lg:p-8">
          <div className="flex justify-center">
            <img
              className="w-full max-w-[520px] rounded mix-blend-difference"
              src={profilePic}
              alt="Muhammad Zain"
              width="1040"
              height="1387"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
