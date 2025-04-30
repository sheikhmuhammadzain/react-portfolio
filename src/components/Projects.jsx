import { motion } from "framer-motion";
import { PROJECTS } from "../constants"; // Assuming PROJECTS array is defined here
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

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


// Animation variants for cards (optional stagger effect)
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({ // Custom prop 'i' for stagger
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Stagger delay based on index
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Projects = () => {
  return (
    <div className="border-b border-neutral-800/50 pb-24"> {/* Increased padding bottom */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100" // Adjusted text color/weight
      >
        Projects
      </motion.h2>

      {/* Grid layout for project cards */}
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={index}
            custom={index} // Pass index for stagger calculation
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is visible
            whileHover={{ scale: 1.03, y: -5 }} // Scale up and lift on hover
            transition={{ type: "spring", stiffness: 300, damping: 15 }} // Spring animation for hover
            className="
              group relative flex flex-col overflow-hidden rounded-lg
              border border-neutral-700/50 bg-neutral-900/40
              shadow-md backdrop-blur-sm
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:shadow-purple-900/20 hover:border-neutral-600
            "
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden"> {/* Fixed height container */}
              <img
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" // Zoom effect on hover
                src={project.image}
                alt={project.title}
              />
               {/* Optional: subtle overlay on hover */}
               <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6"> {/* Use flex-1 to push links to bottom */}
              <h6 className="mb-2 text-xl font-semibold text-neutral-100">
                {project.title}
              </h6>
              <p className="mb-4 flex-grow text-sm text-neutral-400"> {/* Use flex-grow to take available space */}
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
              <div className="mt-auto flex items-center justify-start gap-4 border-t border-neutral-700/50 pt-4"> {/* mt-auto pushes this down */}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-400 transition-colors duration-200 hover:text-purple-400"
                    aria-label={`${project.title} GitHub Repository`}
                  >
                    <FaGithub className="mr-2 h-5 w-5" />
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
                    <FaExternalLinkAlt className="mr-2 h-4 w-4" /> {/* Slightly smaller icon */}
                     <span className="text-sm">Live Demo</span>
                  </a>
                )}
                {/* Optional: Placeholder if no links */}
                {!project.githubLink && !project.liveLink && (
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