import { motion } from "framer-motion";
import aboutImg from "../assets/about.jpg";
import { ABOUT_TEXT } from "../constants";
const About = () => {
  const aboutLines = ABOUT_TEXT.split("\n").map((line) => line.trim()).filter(Boolean);

  const summaryLine = aboutLines[0] ?? "";
  const bulletLines = aboutLines.filter((line) => line.startsWith("• ")).map((line) => line.slice(2).trim());

  return (
    <div className="border-b border-neutral-900 pb-16 pt-8">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="text-4xl text-center mb-12"
      >
        About <span className="text-neutral-500">Me</span>
      </motion.h2>
      <div className="flex flex-wrap">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex items-center justify-center ">
            <img className="rounded-2xl lg:w-96" src={aboutImg} alt="Muhammad Zain - Professional profile photo showing Gen-AI Engineer" />
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex justify-center lg:justify-start">
            <div className="my-2 max-w-xl py-6 space-y-2">
              <p className="text-sm font-light leading-tight">
                {summaryLine}
              </p>
              
              <h3 className="text-base font-medium text-neutral-200 mt-4 mb-2">
                Core Strengths:
              </h3>
              
              <ul className="space-y-1 ml-4">
                {bulletLines.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                    <span className="text-sm font-light leading-tight">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
