import { motion } from "framer-motion";
import { PROJECTS } from "../constants"; // Assuming PROJECTS array is defined here
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

// Placeholder PROJECTS data structure if needed for testing:
// const PROJECTS = [
//   {
//     title: "Project One",
//     image: "https://via.placeholder.com/400x250/333/888?text=Project+One",
//     description: "A brief description of Project One, highlighting its key features and purpose.",
//     technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
//     githubLink: "https://github.com",
//     liveLink: "https://example.com",
//   },
//   {
//     title: "Project Two",
//     image: "https://via.placeholder.com/400x250/444/999?text=Project+Two",
//     description: "Description for Project Two. Built with modern web technologies for optimal performance.",
//     technologies: ["Vue", "Firebase", "SCSS"],
//     githubLink: "https://github.com",
//     liveLink: null, // Example with no live link
//   },
//   {
//     title: "Project Three",
//     image: "https://via.placeholder.com/400x250/555/aaa?text=Project+Three",
//     description: "Project Three showcases advanced concepts in backend development and API integration.",
//     technologies: ["Python", "Django", "PostgreSQL", "Docker"],
//     githubLink: null, // Example with no github link
//     liveLink: "https://example.com",
//   },
// ];


// Animation variants for cards (stagger effect)
// Using performant properties: opacity and transform (y)
const cardVariants = {
  hidden: { opacity: 0, y: 30 }, // Start slightly lower
  visible: (i) => ({ // Custom prop 'i' for stagger
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08, // Slightly faster stagger delay
      duration: 0.4,  // Slightly faster duration
      ease: "easeOut", // Smooth easing
    },
  }),
};

// Animation variants for the heading
const headingVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5, // Keep duration reasonable
            ease: "easeOut"
        }
    }
};


const Projects = () => {
  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }} // Trigger when 30% visible for heading
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Projects
      </motion.h2>

      {/* Grid layout for project cards */}
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.title + index} // Use a more robust key if titles aren't unique
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // Trigger animation when 30% is visible
            // Hover effect using Framer Motion spring for smooth, physical feel
            whileHover={{ scale: 1.03, y: -6 }} // Subtle lift and scale
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Fine-tuned spring params
            className="
              group relative flex flex-col overflow-hidden rounded-lg
              border border-neutral-700/50 bg-neutral-900/40
              shadow-md backdrop-blur-sm
              hover:border-neutral-600 hover:shadow-xl hover:shadow-purple-900/20
              // --- Optimization: Specific CSS transitions ---
              transition-[border-color,box-shadow] duration-300 ease-in-out
              // We let Framer Motion handle transform (scale, y) via whileHover
            "
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
              <motion.img // Animate image scale slightly differently if needed, or stick to CSS
                className={`h-full w-full ${
                  project.imageFit === "contain"
                    ? "object-contain bg-neutral-950 p-2"
                    : "object-cover"
                }`}
                src={project.image}
                alt={project.title}
                // --- CSS driven scale on group hover ---
                // Applying scale via CSS transition on the image itself
                // Framer motion `whileHover` is on the parent card
                // This ensures smoothness and leverages CSS efficiency for simple transforms
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }} // Can also use FM here if preferred
                transition={{ duration: 0.3, ease: "easeOut" }} // Match CSS duration
                // --- OR use pure CSS as before (often simpler for this case): ---
                // className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
               {/* Subtle overlay on hover */}
               {project.imageFit !== "contain" && (
                 <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
               )}
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">
                {project.title}
              </h3>
              <p className="mb-4 flex-grow text-sm text-neutral-400">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-purple-400 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

               {/* Links - Placed at the bottom */}
              <div className="mt-auto flex items-center justify-start gap-4 border-t border-neutral-700/50 pt-4">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-400 transition-colors duration-200 hover:text-purple-400"
                    aria-label={`${project.title} GitHub Repository`}
                  >
                    <FaGithub className="mr-2 h-5 w-5 shrink-0" /> {/* Added shrink-0 */}
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-400 transition-colors duration-200 hover:text-purple-400"
                     aria-label={`${project.title} Live Demo`}
                  >
                    <FaExternalLinkAlt className="mr-2 h-4 w-4 shrink-0" /> {/* Added shrink-0 */}
                     <span className="text-sm">Live Demo</span>
                  </a>
                )}
                {project.blogLink && (
                  <Link
                    to={project.blogLink}
                    className="flex items-center text-neutral-400 transition-colors duration-200 hover:text-purple-400"
                    aria-label={`${project.title} Blog`}
                  >
                    <span className="text-sm">Read Blog</span>
                  </Link>
                )}
                {/* Optional: Placeholder if no links */}
                {!project.githubLink && !project.liveLink && !project.blogLink && (
                    <span className="text-xs text-neutral-600 italic">No links available</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
