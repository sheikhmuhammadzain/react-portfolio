import { motion } from "framer-motion";
import { EXPERIENCES } from "../constants"; // Assuming EXPERIENCES is sorted chronologically (oldest first or newest first)

// Animation variant for list items (fade in and slide up slightly)
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ // Custom prop 'i' for stagger
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15, // Adjust stagger delay as needed
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};


const Experience = () => {
  // Optional: Ensure experiences are sorted if needed (e.g., oldest first)
  // const sortedExperiences = [...EXPERIENCES].sort((a, b) => /* your sorting logic based on year */);
  // Then map over sortedExperiences instead of EXPERIENCES

  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Experience
      </motion.h2>

      {/* Container for the experience list */}
      <div className="max-w-4xl mx-auto px-4"> {/* Centered container */}
        {EXPERIENCES.map((experience, index) => (
          <motion.div
            key={index}
            custom={index} // Pass index for stagger
            variants={listItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% is visible
            className="mb-10 flex flex-wrap lg:flex-nowrap justify-start" // Use flex for layout, allow wrapping on small screens
          >
            {/* Left Column: Year */}
            <div className="w-full lg:w-1/4 mb-4 lg:mb-0 lg:pr-8">
              <p className="text-sm font-medium text-neutral-400">
                {experience.year}
              </p>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-3/4 lg:pl-4 border-l border-neutral-700/50 lg:border-l-0 lg:pl-0"> {/* Optional: Add border only on small screens */}
                <h3 className="mb-1 text-lg font-semibold text-neutral-100">
                    {experience.role} -{" "}
                    <span className="text-base font-medium text-purple-300/90"> {/* Slightly dimmed purple */}
                    {experience.company}
                    </span>
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-neutral-300">
                    {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, techIndex) => (
                    <span
                        key={techIndex}
                        className="rounded bg-neutral-800/80 px-2 py-1 text-xs font-medium text-purple-400 shadow-sm" // Slightly adjusted tech tag style
                    >
                        {tech}
                    </span>
                    ))}
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;