import { HERO_CONTENT } from "../constants";
import profilePic from "../assets/winterdp.jpg";
import resume from "../assets/resume/my_resume-zain.pdf";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons/core-free-icons";

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
              className="hero-fade-up bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent"
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
              <a
                href={resume}
                download="Muhammad_Zain_Resume.pdf"
                className="group relative inline-flex w-fit items-center rounded-xl p-px text-sm font-medium text-neutral-100 mb-8 md:mb-0 transition-all duration-200 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
                  boxShadow:
                    "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.6) inset, 0 1px 2px 0 rgba(0,0,0,0.5)",
                }}
              >
                <span
                  className="flex items-center gap-2 rounded-[11px] px-6 py-3 transition-colors duration-200 group-hover:brightness-110"
                  style={{
                    background:
                      "linear-gradient(180deg, #1f1f24 0%, #131316 100%)",
                    boxShadow:
                      "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 -2px 6px 0 rgba(0,0,0,0.4) inset",
                  }}
                >
                  <HugeiconsIcon icon={Download04Icon} size={18} strokeWidth={1.8} /> Download Resume
                </span>
              </a>
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
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
