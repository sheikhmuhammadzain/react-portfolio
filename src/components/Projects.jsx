import { motion } from "framer-motion";
import { PROJECTS } from "../constants"; // Assuming PROJECTS array is defined here
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import TiltCard from "./TiltCard";

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
        viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.2 }}
          >
          {/* Tilt lives on a child of the motion.div so the two never fight over `transform` */}
          <TiltCard
            className="
              group relative flex h-full flex-col overflow-hidden rounded-lg
              border border-neutral-700/50 bg-neutral-900
              shadow-md
              hover:border-neutral-600 hover:shadow-xl hover:shadow-purple-900/20
            "
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                className={`h-full w-full transition-transform duration-300 ease-out group-hover:scale-105 ${
                  project.imageFit === "contain"
                    ? "object-contain bg-neutral-950 p-2"
                    : "object-cover"
                }`}
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
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
                    <HugeiconsIcon icon={GithubIcon} size={20} strokeWidth={1.8} className="mr-2 shrink-0" />
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
                    <HugeiconsIcon icon={LinkSquare02Icon} size={16} strokeWidth={1.8} className="mr-2 shrink-0" />
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
          </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
