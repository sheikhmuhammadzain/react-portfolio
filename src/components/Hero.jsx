import { HERO_CONTENT } from "../constants";
import profilePic from "../assets/winterdp.jpg";
import resume from "../assets/resume/my_resume-zain.pdf";
import { FaDownload } from "react-icons/fa";
import ScrollTrigger from "./ScrollTrigger";

const Hero = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 mb-16">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col items-center lg:items-start">
            <ScrollTrigger animation="fade-up" delay={0}>
              <h1 className="pb-8 text-6xl font-thin tracking-tight lg:mt-16 
                lg:text-8xl max-sm:text-center">
                Muhammad Zain
              </h1>
            </ScrollTrigger>
            
            <ScrollTrigger animation="fade-up" delay={200}>
              <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent">
                Full Stack AI Developer
              </span>
            </ScrollTrigger>
            
            <ScrollTrigger animation="fade-up" delay={400}>
              <p className="my-2 max-w-xl py-6 font-light tracking-tighter">
                {HERO_CONTENT}
              </p>
              <a
                href={resume}
                download="Muhammad_Zain_Resume.pdf"
                className="inline-flex items-center gap-2 rounded-full bg-purple-900/30 px-6 py-3 text-sm font-medium text-purple-200 transition-all hover:bg-purple-800/50 hover:text-white hover:scale-105 border border-purple-800/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <FaDownload /> Download Resume
              </a>
            </ScrollTrigger>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:p-8">
          <div className="flex justify-center">
            <ScrollTrigger animation="fade-left" threshold={0.1}>
              <img  
                className="rounded mix-blend-difference"
                src={profilePic}
                alt="Muhammad Zain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </ScrollTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
