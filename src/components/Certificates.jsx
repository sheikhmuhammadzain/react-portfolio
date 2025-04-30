import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

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

const Certificates = () => {
  const certificates = [
    {
      title: "Intro to AI Engineering",
      organization: "Scrimba",
      logo: "scrimba",
      date: "Mar 2025",
      credentialId: "4LFT2WY1XS0F",
      skills: []
    },
    {
      title: "Learn AI Agents",
      organization: "Scrimba",
      logo: "scrimba",
      date: "Mar 2025",
      credentialId: "EJS513JTFG8J",
      skills: ["AI", "Python (Programming Language)"]
    },
    {
      title: "Crash Course on Python",
      organization: "Google",
      logo: "google",
      date: "Feb 2025",
      credentialId: "1L69KG93RRQK",
      skills: ["Python (Programming Language)"]
    },
    {
      title: "Generative AI for Software Development",
      organization: "DeepLearning.AI",
      logo: "deeplearning",
      date: "Feb 2025",
      credentialId: "K1BJJAR8566G",
      skills: []
    },
    {
      title: "Introduction to Generative AI for Software Development",
      organization: "DeepLearning.AI",
      logo: "deeplearning",
      date: "Jan 2025",
      credentialId: "X32R8PPX1S70",
      skills: ["Python (Programming Language)"]
    },
    {
      title: "Team Software Engineering with AI",
      organization: "DeepLearning.AI",
      logo: "deeplearning",
      date: "Jan 2025",
      credentialId: "",
      skills: ["AI", "Machine Learning"]
    },
    {
      title: "Responsive Web Design",
      organization: "freeCodeCamp",
      logo: "freecodecamp",
      date: "Jul 2024",
      credentialId: "sheikhmuhammadzain-rwd",
      skills: ["Cascading Style Sheets (CSS)"]
    }
  ];

  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Certificates
      </motion.h2>

      {/* Grid layout for certificate cards */}
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {certificates.map((certificate, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="
              group relative flex flex-col overflow-hidden rounded-lg
              border border-neutral-700/50 bg-neutral-900/40
              shadow-md backdrop-blur-sm
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:shadow-purple-900/20 hover:border-neutral-600
            "
          >
            {/* Logo Section */}
            <div className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
              <div className="h-16 w-auto transition-transform duration-300 ease-in-out group-hover:scale-110">
                {getLogo(certificate.logo)}
              </div>
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6">
              <h6 className="mb-2 text-xl font-semibold text-neutral-100">
                {certificate.title}
              </h6>
              <p className="mb-3 text-sm text-neutral-400">
                {certificate.organization}
              </p>
              
              <div className="mb-4 text-sm text-neutral-400">
                <p>Issued {certificate.date}</p>
                {certificate.credentialId && (
                  <p className="text-xs">Credential ID: {certificate.credentialId}</p>
                )}
              </div>

              {/* Skills */}
              {certificate.skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {certificate.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-purple-400 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Show Credential Link */}
              {certificate.credentialId && (
                <div className="mt-auto flex items-center justify-start gap-4 border-t border-neutral-700/50 pt-4">
                  <a
                    href="#"
                    className="flex items-center text-neutral-400 transition-colors duration-200 hover:text-purple-400"
                    aria-label="Show credential"
                  >
                    <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                    <span className="text-sm">Show credential</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const getLogo = (logo) => {
  switch (logo) {
    case "scrimba":
      return (
        <img 
          src="https://images.squarespace-cdn.com/content/v1/670e19b4ec92287da728eb2b/861f1806-9999-4aa6-a116-ee67ea1cfce3/Scrimba.png" 
          alt="Scrimba"
          className="h-full w-auto object-contain"
        />
      );
    case "google":
      return (
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
          alt="Google"
          className="h-10 w-auto object-contain"
        />
      );
    case "deeplearning":
      return (
        <img 
          src="https://learn.deeplearning.ai/assets/dlai-logo.png" 
          alt="DeepLearning.AI"
          className="h-14 w-auto object-contain"
        />
      );
    case "freecodecamp":
      return (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/FreeCodeCamp_logo.svg/2560px-FreeCodeCamp_logo.svg.png" 
          alt="freeCodeCamp"
          className="h-12 w-auto object-contain"
        />
      );
    default:
      return <div className="h-full w-full bg-neutral-700"></div>;
  }
};

export default Certificates;