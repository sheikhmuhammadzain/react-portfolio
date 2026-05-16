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

const Hero = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 mb-16">
      <div className="flex flex-wrap">
        <motion.div
          variants={container}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.3 }}
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
                  <FaDownload /> Download Resume
                </span>
              </a>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex justify-center">
            <img
              className="w-full max-w-[520px] rounded mix-blend-difference"
              src={profilePic}
              alt="Muhammad Zain"
              width="3024"
              height="4032"
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
