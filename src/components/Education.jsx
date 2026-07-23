import { motion } from "framer-motion";
import uolLogo from "/UOL.png";

const EDUCATION = [
  {
    period: "Sep 2022 - Jun 2026",
    degree: "BS Information Engineering Technology",
    institution: "University of Lahore",
    grade: "Grade A",
    logo: uolLogo,
  },
];

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const Education = () => {
  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Education
      </motion.h2>

      <div className="max-w-4xl mx-auto px-4">
        {EDUCATION.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={listItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-10 flex flex-wrap lg:flex-nowrap justify-start"
          >
            {/* Left Column: Period */}
            <div className="w-full lg:w-1/4 mb-4 lg:mb-0 lg:pr-8">
              <p className="text-sm font-medium text-neutral-400">{item.period}</p>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-3/4">
              <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-semibold text-neutral-100">
                <span>{item.degree} -</span>
                <img
                  src={item.logo}
                  alt={`${item.institution} logo`}
                  loading="lazy"
                  className="h-14 w-auto max-w-[180px] object-contain"
                />
                <span className="rounded bg-neutral-800/80 px-2 py-1 text-xs font-medium text-purple-400 shadow-sm">
                  {item.grade}
                </span>
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Education;
