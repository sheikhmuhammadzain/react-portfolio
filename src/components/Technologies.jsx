import {  motion } from "framer-motion";
import { BiLogoPostgresql } from "react-icons/bi";
import { DiRedis, DiPython } from "react-icons/di";
import { FaNodeJs } from "react-icons/fa";
import { RiReactjsLine } from "react-icons/ri";
import { SiMongodb, SiOpenai, SiFastapi } from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
const iconVariants = (duration) => ({
  initial: { y: -10 },
  animate: {
    y: [10, -10],
    transition: {
      duration: duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
});

const Technologies = () => {
  return (
    <div className="border-b border-neutral-800 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false, amount: 0.3 }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Technologies
      </motion.h2>
      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <motion.div
          variants={iconVariants(2.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <RiReactjsLine className="text-6xl text-cyan-400" />
        </motion.div>
        <motion.div
          variants={iconVariants(3)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <TbBrandNextjs className="text-6xl " />
        </motion.div>
        <motion.div
          variants={iconVariants(4)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <DiPython className="text-6xl text-blue-500" />
        </motion.div>
        <motion.div
          variants={iconVariants(5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <SiOpenai className="text-6xl text-green-400" />
        </motion.div>
        <motion.div
          variants={iconVariants(2.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <SiMongodb className="text-6xl text-green-500" />
        </motion.div>
        <motion.div
          variants={iconVariants(3)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <FaNodeJs className="text-6xl text-green-500" />
        </motion.div>
      
       
        <motion.div
          variants={iconVariants(6)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <SiFastapi className="text-6xl text-green-600" />
        </motion.div>
        <motion.div
          variants={iconVariants(2)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <BiLogoPostgresql className="text-6xl text-sky-700" />
        </motion.div>
        <motion.div
          variants={iconVariants(2.8)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 "
        >
          <DiRedis className="text-6xl text-red-500" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Technologies;
