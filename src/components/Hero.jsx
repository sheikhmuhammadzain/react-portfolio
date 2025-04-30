import { HERO_CONTENT } from "../constants";
import profilePic from "../assets/winterdp.jpg";
import ScrollTrigger from "./ScrollTrigger";

const Hero = () => {
  return (
    <div className="border-b border-neutral-900 pb-4 lg:mb-35" data-scroll-section>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col items-center lg:items-start">
            <ScrollTrigger animation="fade-up" delay={0}>
              <h1 className="pb-16 text-6xl font-thin tracking-tight lg:mt-16 
                lg:text-8xl max-sm:text-center">
                Muhammad Zain
              </h1>
            </ScrollTrigger>
            
            <ScrollTrigger animation="fade-up" delay={200}>
              <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent">
                Full Stack Developer
              </span>
            </ScrollTrigger>
            
            <ScrollTrigger animation="fade-up" delay={400}>
              <p className="my-2 max-w-xl py-6 font-light tracking-tighter">
                {HERO_CONTENT}
              </p>
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
              />
            </ScrollTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
