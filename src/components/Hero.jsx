import { motion } from "framer-motion";
import { HERO_CONTENT } from "../constants";
import profilePic from "../assets/winterdp.jpg";
import resume from "../assets/resume/my_resume-zain.pdf";
import { FaDownload } from "react-icons/fa";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  },
});

const fadeLeft = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const Hero = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 mb-16">
      <div className="flex flex-wrap">
        <motion.div
          variants={container}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex flex-col items-center lg:items-start">
            <motion.h1
              variants={fadeUp(0)}
              className="pb-8 text-6xl font-thin tracking-tight lg:mt-16 
                lg:text-8xl max-sm:text-center"
            >
              Muhammad Zain
            </motion.h1>

            <motion.span
              variants={fadeUp(0.2)}
              className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent"
            >
              Full Stack AI Developer
            </motion.span>

            <motion.div
              variants={fadeUp(0.4)}
              className="flex flex-col items-center lg:items-start gap-8"
            >
              <p className="my-2 max-w-xl py-6 font-light tracking-tighter">
                {HERO_CONTENT}
              </p>
              <a
                href={resume}
                download="Muhammad_Zain_Resume.pdf"
                className="flex w-fit items-center gap-2 rounded-full bg-purple-900/30 px-6 py-3 text-sm mb-8 md:mb-0 font-medium text-purple-200 transition-all hover:bg-purple-800/50 hover:text-white hover:scale-105 border border-purple-800/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <FaDownload /> Download Resume
              </a>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex justify-center">
            <img  
              className="rounded mix-blend-difference"
              src={profilePic}
              alt="Muhammad Zain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
